import { Request, Response } from 'express';
import { IMessageListResponse, ISendMessageBody } from 'titan_core';
import { Controller, ILocals, LoggerModel } from '../../core';
import messageService from '../../services/message.service';
import conversationService from '../../services/conversation.service';
import { HttpResponseError } from '../../modules/http-response-error';
import AppConfig from '../../modules/app-config.module';

class MessageController implements Controller {
  private static readonly logger = new LoggerModel(MessageController.name);

  async list(
    req: Request<{ conversationId: string }>,
    res: Response<IMessageListResponse, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const { conversationId } = req.params;

    const isParticipant = await conversationService.isParticipant(
      conversationId,
      userId,
    );
    if (!isParticipant) {
      throw HttpResponseError.createUnauthorized();
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

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
    const { conversationId } = req.params;

    const isParticipant = await conversationService.isParticipant(
      conversationId,
      userId,
    );
    if (!isParticipant) {
      throw HttpResponseError.createUnauthorized();
    }

    const message = await messageService.create({
      conversationId,
      senderId: userId,
      content: req.body.content,
      type: req.body.type,
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
}

export default new MessageController();
