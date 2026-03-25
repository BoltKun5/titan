import { Request, Response } from 'express';
import {
  IMessageListResponse,
  ISendMessageBody,
  MessageType,
} from 'titan_core';
import { Controller, ILocals, LoggerModel } from '../../core';
import messageService from '../../services/message.service';
import conversationService from '../../services/conversation.service';
import { HttpResponseError } from '../../modules/http-response-error';
import AppConfig from '../../modules/app-config.module';
import MessageValidation from '../validations/message.validation';

class MessageController implements Controller {
  private static readonly logger = new LoggerModel(MessageController.name);

  async list(
    req: Request<{ conversationId: string }>,
    res: Response<IMessageListResponse, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const { conversationId } = MessageValidation.listParams(req.params);

    const isParticipant = await conversationService.isParticipant(
      conversationId,
      userId,
    );
    if (!isParticipant) {
      throw HttpResponseError.createUnauthorized();
    }

    const { page, limit } = MessageValidation.listQuery(
      req.query as { page?: string; limit?: string },
    );

    const result = await messageService.getMessages({
      conversationId,
      page,
      limit,
    });

    res.json({
      messages: result.messages,
      maxPages: result.maxPages,
      currentPage: result.currentPage,
      totalItems: result.totalItems,
    });
  }

  async send(
    req: Request<{ conversationId: string }, unknown, ISendMessageBody>,
    res: Response<{ message: any }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const { conversationId } = MessageValidation.listParams(
      req.params as { conversationId: string },
    );

    const isParticipant = await conversationService.isParticipant(
      conversationId,
      userId,
    );
    if (!isParticipant) {
      throw HttpResponseError.createUnauthorized();
    }

    req.body = MessageValidation.sendBody(req.body);

    const message = await messageService.create({
      conversationId,
      senderId: userId,
      content: req.body.content,
      type: req.body.type,
      replyToId: req.body.replyToId,
    });

    // Emit to all connected participants via Socket.IO
    if (AppConfig.io) {
      AppConfig.io.to(`conversation:${conversationId}`).emit('message:new', {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: message.content,
        type: message.type,
        createdAt: message.getDataValue('createdAt' as any),
      });
    }

    res.status(201).json({ message });
  }

  async search(
    req: Request<{ conversationId: string }, unknown, never, { q?: string }>,
    res: Response<{ messages: any[] }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const { conversationId } = MessageValidation.listParams(req.params);
    const query = (req.query.q || '').toString().trim();

    if (!query) {
      res.json({ messages: [] });
      return;
    }

    const isParticipant = await conversationService.isParticipant(
      conversationId,
      userId,
    );
    if (!isParticipant) {
      throw HttpResponseError.createUnauthorized();
    }

    const messages = await messageService.searchMessages(conversationId, query);
    res.json({ messages });
  }

  async searchGlobal(
    req: Request<Record<string, never>, unknown, never, { q?: string }>,
    res: Response<{ messages: any[] }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const query = (req.query.q || '').toString().trim();

    if (!query) {
      res.json({ messages: [] });
      return;
    }

    const messages = await messageService.searchGlobal(userId, query);
    res.json({ messages });
  }

  async uploadFile(
    req: Request<{ conversationId: string }>,
    res: Response<{ message: any }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const { conversationId } = MessageValidation.listParams(req.params);

    if (!req.file) {
      throw HttpResponseError.createValidationError();
    }

    const isParticipant = await conversationService.isParticipant(
      conversationId,
      userId,
    );
    if (!isParticipant) {
      throw HttpResponseError.createUnauthorized();
    }

    // Determine message type from file mime type
    const mime = req.file.mimetype;
    let type = MessageType.FILE;
    if (mime.startsWith('image/')) {
      type = MessageType.IMAGE;
    } else if (mime.startsWith('video/')) {
      type = MessageType.VIDEO;
    } else if (mime.startsWith('audio/')) {
      type = MessageType.AUDIO;
    }

    const fileUrl = `/uploads/messages/${req.file.filename}`;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;

    const message = await messageService.create({
      conversationId,
      senderId: userId,
      content: fileName,
      type,
      fileUrl,
      fileName,
      fileSize,
    });

    if (AppConfig.io) {
      AppConfig.io.to(`conversation:${conversationId}`).emit('message:new', {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: message.content,
        type: message.type,
        fileUrl: message.fileUrl,
        fileName: message.fileName,
        fileSize: message.fileSize,
        createdAt: message.getDataValue('createdAt' as any),
      });
    }

    res.status(201).json({ message });
  }
}

export default new MessageController();
