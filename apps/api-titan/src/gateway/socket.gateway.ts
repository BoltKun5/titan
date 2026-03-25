import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import {
  SessionToken,
  ClientToServerEvents,
  ServerToClientEvents,
  MessageType,
  MessageStatus,
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

  // Track online users: userId -> Set of socket ids
  const onlineUsers = AppConfig.onlineUsers;

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

      // Track online presence
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId)!.add(socket.id);

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

      // Broadcast online status to all conversation members
      for (const p of participations) {
        socket.to(`conversation:${p.conversationId}`).emit('user:online', {
          userId,
          isOnline: true,
        });
      }

      // Handle sending a message
      socket.on(
        'message:send',
        async (
          data: {
            conversationId: string;
            content: string;
            type?: string;
            replyToId?: string;
            fileUrl?: string;
            fileName?: string;
            fileSize?: number;
          },
          callback: any,
        ) => {
          try {
            const {
              conversationId,
              content,
              replyToId,
              fileUrl,
              fileName,
              fileSize,
            } = data;

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

            const msgType = (data.type as MessageType) || MessageType.TEXT;

            const message = await messageService.create({
              conversationId,
              senderId: userId,
              content,
              type: msgType,
              replyToId,
              fileUrl,
              fileName,
              fileSize,
            });

            const messagePayload = {
              id: message.id,
              conversationId: message.conversationId,
              senderId: message.senderId,
              content: message.content,
              type: message.type,
              status: MessageStatus.SENT,
              isEdited: false,
              isDeleted: false,
              replyToId: message.replyToId || null,
              replyTo: message.replyTo
                ? {
                    id: message.replyTo.id,
                    conversationId: message.replyTo.conversationId,
                    senderId: message.replyTo.senderId,
                    content: message.replyTo.content,
                    type: message.replyTo.type,
                    sender: message.replyTo.sender,
                  }
                : null,
              fileUrl: message.fileUrl || null,
              fileName: message.fileName || null,
              fileSize: message.fileSize || null,
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

      // Handle editing a message
      socket.on(
        'message:edit',
        async (data: { messageId: string; content: string }, callback: any) => {
          try {
            const { messageId, content } = data;

            if (!content || content.trim().length === 0) {
              socket.emit('error', { message: 'Content cannot be empty' });
              return;
            }

            const message = await messageService.edit(
              messageId,
              userId,
              content,
            );

            if (!message) {
              socket.emit('error', {
                message: 'Message not found or not owned by you',
              });
              return;
            }

            const messagePayload = {
              id: message.id,
              conversationId: message.conversationId,
              senderId: message.senderId,
              content: message.content,
              type: message.type,
              isEdited: message.isEdited,
              isDeleted: message.isDeleted,
              createdAt: message.getDataValue('createdAt' as any),
            };

            // Broadcast edit to all participants
            socket
              .to(`conversation:${message.conversationId}`)
              .emit('message:edited', messagePayload);

            if (callback) {
              callback(messagePayload);
            }
          } catch (error) {
            socket.emit('error', { message: 'Failed to edit message' });
          }
        },
      );

      // Handle deleting a message
      socket.on(
        'message:delete',
        async (
          data: { messageId: string; forEveryone: boolean },
          callback: any,
        ) => {
          try {
            const { messageId, forEveryone } = data;

            const result = await messageService.delete(
              messageId,
              userId,
              forEveryone,
            );

            if (!result) {
              socket.emit('error', {
                message: 'Message not found or not owned by you',
              });
              return;
            }

            if (forEveryone) {
              // Broadcast deletion to all participants
              socket
                .to(`conversation:${result.conversationId}`)
                .emit('message:deleted', {
                  messageId,
                  conversationId: result.conversationId,
                });
            }

            if (callback) {
              callback(true);
            }
          } catch (error) {
            socket.emit('error', { message: 'Failed to delete message' });
          }
        },
      );

      // Handle emoji reaction toggle
      socket.on(
        'message:react',
        async (data: { messageId: string; emoji: string }, callback: any) => {
          try {
            const { messageId, emoji } = data;

            if (!emoji || emoji.length > 8) {
              socket.emit('error', { message: 'Invalid emoji' });
              return;
            }

            const result = await messageService.toggleReaction(
              messageId,
              userId,
              emoji,
            );

            if (!result) {
              socket.emit('error', { message: 'Message not found' });
              return;
            }

            const reactionPayload = {
              messageId,
              conversationId: result.conversationId,
              reaction: result.reaction
                ? {
                    id: result.reaction.id,
                    messageId: result.reaction.messageId,
                    userId: result.reaction.userId,
                    emoji: result.reaction.emoji,
                  }
                : null,
              action: result.action,
            };

            // Broadcast to all participants
            socket
              .to(`conversation:${result.conversationId}`)
              .emit('message:reaction', reactionPayload as any);

            if (callback) {
              callback(result.reaction);
            }
          } catch (error) {
            socket.emit('error', { message: 'Failed to toggle reaction' });
          }
        },
      );

      // Handle joining a conversation room (for new conversations)
      socket.on('conversation:join', (data: { conversationId: string }) => {
        socket.join(`conversation:${data.conversationId}`);
      });

      // Handle forwarding a message to another conversation
      socket.on(
        'message:forward',
        async (
          data: { messageId: string; targetConversationId: string },
          callback: any,
        ) => {
          try {
            const { messageId, targetConversationId } = data;

            const isParticipant = await conversationService.isParticipant(
              targetConversationId,
              userId,
            );
            if (!isParticipant) {
              socket.emit('error', {
                message: 'Not a participant of the target conversation',
              });
              return;
            }

            const message = await messageService.forwardMessage(
              messageId,
              targetConversationId,
              userId,
            );

            if (!message) {
              socket.emit('error', { message: 'Original message not found' });
              return;
            }

            const messagePayload = {
              id: message.id,
              conversationId: message.conversationId,
              senderId: message.senderId,
              content: message.content,
              type: message.type,
              status: MessageStatus.SENT,
              isEdited: false,
              isDeleted: false,
              replyToId: null,
              replyTo: null,
              fileUrl: message.fileUrl || null,
              fileName: message.fileName || null,
              fileSize: message.fileSize || null,
              createdAt: message.getDataValue('createdAt' as any),
            };

            socket
              .to(`conversation:${targetConversationId}`)
              .emit('message:new', messagePayload);

            io.to(`conversation:${targetConversationId}`).emit(
              'conversation:updated',
              { conversationId: targetConversationId },
            );

            if (callback) {
              callback(messagePayload);
            }
          } catch (error) {
            socket.emit('error', { message: 'Failed to forward message' });
          }
        },
      );

      // Handle leaving a conversation room
      socket.on('conversation:leave', (data: { conversationId: string }) => {
        socket.leave(`conversation:${data.conversationId}`);
      });

      // Handle message delivery confirmation
      socket.on(
        'message:delivered',
        async (data: { messageIds: string[]; conversationId: string }) => {
          try {
            const { Message } = await import('../database');
            const { Op } = await import('sequelize');
            await Message.update(
              { status: MessageStatus.DELIVERED },
              {
                where: {
                  id: { [Op.in]: data.messageIds },
                  status: MessageStatus.SENT,
                  senderId: { [Op.ne]: userId },
                },
              },
            );

            // Notify the senders that their messages were delivered
            for (const msgId of data.messageIds) {
              socket
                .to(`conversation:${data.conversationId}`)
                .emit('message:status', {
                  messageId: msgId,
                  conversationId: data.conversationId,
                  status: MessageStatus.DELIVERED,
                });
            }
          } catch (error) {
            // Non-critical, just log
          }
        },
      );

      // Handle marking messages as read
      socket.on('message:read', async (data: { conversationId: string }) => {
        await conversationService.markAsRead(data.conversationId, userId);

        // Update message statuses to READ for messages from others
        try {
          const { Message } = await import('../database');
          const { Op } = await import('sequelize');
          const updated = await Message.update(
            { status: MessageStatus.READ },
            {
              where: {
                conversationId: data.conversationId,
                senderId: { [Op.ne]: userId },
                status: { [Op.ne]: MessageStatus.READ },
              },
            },
          );

          if (updated[0] > 0) {
            // Broadcast read status to the conversation
            socket
              .to(`conversation:${data.conversationId}`)
              .emit('conversation:updated', {
                conversationId: data.conversationId,
              });
          }
        } catch (error) {
          // Non-critical
        }
      });

      socket.on('disconnect', async () => {
        AppConfig.logger.log(`User ${userId} disconnected from WebSocket`, {
          scenario: LogScenario.SYSTEM_STARTUP,
        });

        // Remove this socket from tracking
        const sockets = onlineUsers.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            onlineUsers.delete(userId);

            // User is fully offline — update lastSeenAt and broadcast
            const now = new Date().toISOString();
            await User.update({ lastSeenAt: now }, { where: { id: userId } });

            const userParticipations = await ConversationParticipant.findAll({
              where: { userId },
              attributes: ['conversationId'],
            });

            for (const p of userParticipations) {
              io.to(`conversation:${p.conversationId}`).emit('user:online', {
                userId,
                isOnline: false,
                lastSeen: now,
              });
            }
          }
        }
      });
    },
  );

  AppConfig.io = io;

  // Cleanup expired ephemeral messages every 30 seconds
  setInterval(async () => {
    try {
      const count = await messageService.cleanupExpiredMessages();
      if (count > 0) {
        AppConfig.logger.log(`Cleaned up ${count} expired ephemeral messages`, {
          scenario: LogScenario.SYSTEM_STARTUP,
        });
      }
    } catch (error) {
      // Non-critical
    }
  }, 30000);

  return io;
};
