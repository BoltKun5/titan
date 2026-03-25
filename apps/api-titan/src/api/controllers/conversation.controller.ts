import { Request, Response } from 'express';
import {
  IConversationListResponse,
  IConversationResponse,
  ICreateConversationBody,
  IUpdateConversationBody,
  IAddParticipantsBody,
} from 'titan_core';
import { Controller, ILocals, LoggerModel } from '../../core';
import conversationService from '../../services/conversation.service';
import { HttpResponseError } from '../../modules/http-response-error';
import ConversationValidation from '../validations/conversation.validation';

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

  async search(
    req: Request<
      Record<string, never>,
      IConversationListResponse,
      never,
      { q?: string }
    >,
    res: Response<IConversationListResponse, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const query = (req.query.q || '').toString().trim();

    if (!query) {
      res.json({ conversations: [] });
      return;
    }

    const conversations = await conversationService.searchConversations(
      userId,
      query,
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

    req.body = ConversationValidation.createBody(req.body);

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
    const { id: conversationId } = ConversationValidation.markAsReadParams(
      req.params,
    );

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

  async updateName(
    req: Request<{ id: string }, { success: boolean }, IUpdateConversationBody>,
    res: Response<{ success: boolean }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const conversationId = req.params.id;

    const conversation = await conversationService.updateName(
      conversationId,
      req.body.name || '',
      userId,
    );

    if (!conversation) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ success: true });
  }

  async addParticipants(
    req: Request<{ id: string }, { success: boolean }, IAddParticipantsBody>,
    res: Response<{ success: boolean }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const conversationId = req.params.id;

    const result = await conversationService.addParticipants(
      conversationId,
      req.body.participantIds,
      userId,
    );

    if (!result) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ success: true });
  }

  async leave(
    req: Request<{ id: string }>,
    res: Response<{ success: boolean }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const conversationId = req.params.id;

    const result = await conversationService.leaveConversation(
      conversationId,
      userId,
    );

    if (!result) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ success: true });
  }

  async updateDescription(
    req: Request<{ id: string }, { success: boolean }, IUpdateConversationBody>,
    res: Response<{ success: boolean }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const conversationId = req.params.id;

    const conversation = await conversationService.updateDescription(
      conversationId,
      req.body.description || '',
      userId,
    );

    if (!conversation) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ success: true });
  }

  async togglePin(
    req: Request<{ id: string }>,
    res: Response<{ isPinned: boolean }, ILocals>,
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

    const isPinned = await conversationService.togglePin(
      conversationId,
      userId,
    );
    res.json({ isPinned });
  }

  async toggleArchive(
    req: Request<{ id: string }>,
    res: Response<{ isArchived: boolean }, ILocals>,
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

    const isArchived = await conversationService.toggleArchive(
      conversationId,
      userId,
    );
    res.json({ isArchived });
  }

  async toggleMute(
    req: Request<{ id: string }>,
    res: Response<{ isMuted: boolean }, ILocals>,
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

    const isMuted = await conversationService.toggleMute(
      conversationId,
      userId,
    );
    res.json({ isMuted });
  }

  async deleteConversation(
    req: Request<{ id: string }>,
    res: Response<{ success: boolean }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const conversationId = req.params.id;

    const result = await conversationService.deleteConversation(
      conversationId,
      userId,
    );

    if (!result) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ success: true });
  }

  async totalUnread(
    _req: Request,
    res: Response<{ totalUnread: number }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const conversations = await conversationService.getUserConversations(
      userId,
    );
    const total = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    res.json({ totalUnread: total });
  }

  async setEphemeral(
    req: Request<
      { id: string },
      { ephemeralDuration: number | null },
      { duration: number | null }
    >,
    res: Response<{ ephemeralDuration: number | null }, ILocals>,
  ): Promise<void> {
    const userId = res.locals.currentUser.id;
    const conversationId = req.params.id;
    const { duration } = req.body;

    const isParticipant = await conversationService.isParticipant(
      conversationId,
      userId,
    );
    if (!isParticipant) {
      throw HttpResponseError.createUnauthorized();
    }

    const result = await conversationService.setEphemeralDuration(
      conversationId,
      userId,
      duration ?? null,
    );

    if (result === null && duration !== null) {
      throw HttpResponseError.createUnauthorized();
    }

    res.json({ ephemeralDuration: result });
  }
}

export default new ConversationController();
