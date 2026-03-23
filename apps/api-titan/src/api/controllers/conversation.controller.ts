import { Request, Response } from 'express';
import {
  IConversationListResponse,
  IConversationResponse,
  ICreateConversationBody,
} from 'titan_core';
import { Controller, ILocals, LoggerModel } from '../../core';
import conversationService from '../../services/conversation.service';
import { HttpResponseError } from '../../modules/http-response-error';

class ConversationController implements Controller {
  private static readonly logger = new LoggerModel(ConversationController.name);

  async list(
    _req: Request,
    res: Response<IConversationListResponse, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;

    ConversationController.logger.log(`User ${userId} fetching conversations`);

    const conversations = await conversationService.getUserConversations(
      userId,
    );

    res.json({ conversations });
  }

  async create(
    req: Request<
      Record<string, never>,
      IConversationResponse,
      ICreateConversationBody
    >,
    res: Response<IConversationResponse, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;

    const conversation = await conversationService.create({
      participantIds: req.body.participantIds,
      name: req.body.name,
      type: req.body.type,
      creatorId: userId,
    });

    const conversations = await conversationService.getUserConversations(
      userId,
    );
    const created = conversations.find((c) => c.id === conversation.id);

    if (!created) {
      throw HttpResponseError.createNotFoundError();
    }

    res.status(201).json({ conversation: created });
  }

  async markAsRead(
    req: Request<{ id: string }>,
    res: Response<{ success: boolean }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const conversationId = req.params.id;

    const isParticipant = await conversationService.isParticipant(
      conversationId,
      userId,
    );
    if (!isParticipant) {
      throw HttpResponseError.createUnauthorized();
    }

    await conversationService.markAsRead(conversationId, userId);

    res.json({ success: true });
  }
}

export default new ConversationController();
