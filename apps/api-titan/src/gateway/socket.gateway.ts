import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import {
  SessionToken,
  ClientToServerEvents,
  ServerToClientEvents,
  MessageType,
} from 'titan_core';
import AppConfig from '../modules/app-config.module';
import { User, ConversationParticipant } from '../database';
import messageService from '../services/message.service';
import conversationService from '../services/conversation.service';
import { LogScenario } from 'abyss_monitor_core';

type AuthenticatedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents
> & {
  userId?: string;
};

export const initializeSocketGateway = (
  httpServer: HTTPServer,
): SocketIOServer => {
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      pingInterval: 25000,
      pingTimeout: 20000,
    },
  );

  // Authentication middleware
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  io.use(async (socket: any, next: any) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(
        token,
        AppConfig.config.app.auth.secretToken,
      ) as SessionToken;
      const user = await User.findOne({ where: { id: decoded.UUID } });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on(
    'connection',
    async (rawSocket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      const socket = rawSocket as AuthenticatedSocket;
      const userId = socket.userId as string;
      AppConfig.logger.log(`User ${userId} connected via WebSocket`, {
        scenario: LogScenario.SYSTEM_STARTUP,
      });

      // Join all user's conversation rooms automatically
      const participations = await ConversationParticipant.findAll({
        where: { userId },
        attributes: ['conversationId'],
      });

      for (const p of participations) {
        socket.join(`conversation:${p.conversationId}`);
      }

      // Join personal room for direct notifications
      socket.join(`user:${userId}`);

      // Handle sending a message
      socket.on(
        'message:send',
        async (
          data: { conversationId: string; content: string },
          callback: any,
        ) => {
          try {
            const { conversationId, content } = data;

            const isParticipant = await conversationService.isParticipant(
              conversationId,
              userId,
            );
            if (!isParticipant) {
              socket.emit('error', {
                message: 'Not a participant of this conversation',
              });
              return;
            }

            const message = await messageService.create({
              conversationId,
              senderId: userId,
              content,
              type: MessageType.TEXT,
            });

            const messagePayload = {
              id: message.id,
              conversationId: message.conversationId,
              senderId: message.senderId,
              content: message.content,
              type: message.type,
              createdAt: message.getDataValue('createdAt' as any),
            };

            // Broadcast to all participants in the conversation
            socket
              .to(`conversation:${conversationId}`)
              .emit('message:new', messagePayload);

            // Notify participants who are not in the room
            io.to(`conversation:${conversationId}`).emit(
              'conversation:updated',
              {
                conversationId,
              },
            );

            // Return the message to sender via callback
            if (callback) {
              callback(messagePayload);
            }
          } catch (error) {
            socket.emit('error', { message: 'Failed to send message' });
          }
        },
      );

      // Handle typing indicator
      socket.on(
        'message:typing',
        (data: { conversationId: string; isTyping: boolean }) => {
          socket
            .to(`conversation:${data.conversationId}`)
            .emit('message:typing', {
              conversationId: data.conversationId,
              userId,
              isTyping: data.isTyping,
            });
        },
      );

      // Handle joining a conversation room (for new conversations)
      socket.on('conversation:join', (data: { conversationId: string }) => {
        socket.join(`conversation:${data.conversationId}`);
      });

      // Handle leaving a conversation room
      socket.on('conversation:leave', (data: { conversationId: string }) => {
        socket.leave(`conversation:${data.conversationId}`);
      });

      // Handle marking messages as read
      socket.on('message:read', async (data: { conversationId: string }) => {
        await conversationService.markAsRead(data.conversationId, userId);
      });

      socket.on('disconnect', () => {
        AppConfig.logger.log(`User ${userId} disconnected from WebSocket`, {
          scenario: LogScenario.SYSTEM_STARTUP,
        });
      });
    },
  );

  AppConfig.io = io;
  return io;
};
