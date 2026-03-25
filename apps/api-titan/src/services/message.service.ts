import { MessageType } from 'titan_core';
import {
  Message,
  User,
  MessageReaction,
  ConversationParticipant,
  Conversation,
} from '../database';
import { Op } from 'sequelize';
import { Service } from '../core';

interface ParamsCreate {
  conversationId: string;
  senderId: string;
  content: string;
  type?: MessageType;
  replyToId?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface ParamsGetMessages {
  conversationId: string;
  page?: number;
  limit?: number;
}

interface PaginatedMessages {
  messages: Message[];
  maxPages: number;
  currentPage: number;
  totalItems: number;
}

class MessageService extends Service {
  public async create(params: ParamsCreate): Promise<Message> {
    // Check if conversation has ephemeral duration
    let expiresAt: string | null = null;
    const conversation = await Conversation.findByPk(params.conversationId);
    if (conversation?.ephemeralDuration) {
      const expiry = new Date(
        Date.now() + conversation.ephemeralDuration * 1000,
      );
      expiresAt = expiry.toISOString();
    }

    const message = await Message.create({
      conversationId: params.conversationId,
      senderId: params.senderId,
      content: params.content,
      type: params.type || MessageType.TEXT,
      replyToId: params.replyToId || null,
      fileUrl: params.fileUrl || null,
      fileName: params.fileName || null,
      fileSize: params.fileSize || null,
      expiresAt,
    });

    // Reload with replyTo if needed
    if (params.replyToId) {
      await message.reload({
        include: [
          {
            model: Message,
            as: 'replyTo',
            include: [
              { model: User, as: 'sender', attributes: ['id', 'shownName'] },
            ],
          },
        ],
      });
    }

    this.logger.log(
      `Message ${message.id} sent in conversation ${params.conversationId}`,
    );

    return message;
  }

  public async getMessages(
    params: ParamsGetMessages,
  ): Promise<PaginatedMessages> {
    const page = params.page || 1;
    const limit = params.limit || 50;

    const totalItems = await Message.count({
      where: { conversationId: params.conversationId },
    });

    const messages = await Message.findAll({
      where: { conversationId: params.conversationId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'shownName', 'avatarUrl'],
        },
        {
          model: Message,
          as: 'replyTo',
          include: [
            { model: User, as: 'sender', attributes: ['id', 'shownName'] },
          ],
        },
        {
          model: MessageReaction,
          as: 'reactions',
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset: limit * (page - 1),
    });

    return {
      messages: messages.reverse(),
      maxPages: Math.ceil(totalItems / limit),
      currentPage: page,
      totalItems,
    };
  }

  public async edit(
    messageId: string,
    senderId: string,
    content: string,
  ): Promise<Message | null> {
    const message = await Message.findOne({
      where: { id: messageId, senderId, isDeleted: false },
    });

    if (!message) {
      return null;
    }

    message.content = content;
    message.isEdited = true;
    await message.save();

    this.logger.log(`Message ${messageId} edited by ${senderId}`);
    return message;
  }

  public async delete(
    messageId: string,
    senderId: string,
    forEveryone: boolean,
  ): Promise<{ conversationId: string } | null> {
    const message = await Message.findOne({
      where: { id: messageId, senderId },
    });

    if (!message) {
      return null;
    }

    if (forEveryone) {
      message.content = '';
      message.isDeleted = true;
      await message.save();
    } else {
      // "Delete for me" — for now, we do a hard delete
      // TODO: Implement per-user message visibility when needed
      await message.destroy();
    }

    this.logger.log(
      `Message ${messageId} deleted by ${senderId} (forEveryone: ${forEveryone})`,
    );
    return { conversationId: message.conversationId };
  }

  public async toggleReaction(
    messageId: string,
    userId: string,
    emoji: string,
  ): Promise<{
    reaction: MessageReaction | null;
    action: 'add' | 'remove';
    conversationId: string;
  } | null> {
    const message = await Message.findByPk(messageId);
    if (!message) {
      return null;
    }

    // Check if user already reacted with this emoji
    const existing = await MessageReaction.findOne({
      where: { messageId, userId, emoji },
    });

    if (existing) {
      await existing.destroy();
      return {
        reaction: existing,
        action: 'remove',
        conversationId: message.conversationId,
      };
    }

    const reaction = await MessageReaction.create({ messageId, userId, emoji });
    return { reaction, action: 'add', conversationId: message.conversationId };
  }

  public async searchMessages(
    conversationId: string,
    query: string,
    limit: number = 20,
  ): Promise<Message[]> {
    return Message.findAll({
      where: {
        conversationId,
        isDeleted: false,
        content: { [Op.iLike]: `%${query}%` },
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'shownName'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  public async searchGlobal(
    userId: string,
    query: string,
    limit: number = 30,
  ): Promise<Message[]> {
    // Get all conversation IDs the user participates in
    const participations = await ConversationParticipant.findAll({
      where: { userId },
      attributes: ['conversationId'],
    });
    const conversationIds = participations.map((p) => p.conversationId);
    if (conversationIds.length === 0) return [];

    return Message.findAll({
      where: {
        conversationId: { [Op.in]: conversationIds },
        isDeleted: false,
        content: { [Op.iLike]: `%${query}%` },
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'shownName'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  public async forwardMessage(
    messageId: string,
    targetConversationId: string,
    senderId: string,
  ): Promise<Message | null> {
    const original = await Message.findByPk(messageId);
    if (!original || original.isDeleted) return null;

    return this.create({
      conversationId: targetConversationId,
      senderId,
      content: original.content,
      type: original.type,
    });
  }

  public async cleanupExpiredMessages(): Promise<number> {
    const expired = await Message.findAll({
      where: {
        expiresAt: { [Op.lte]: new Date() },
        isDeleted: false,
      },
    });

    for (const msg of expired) {
      msg.content = '';
      msg.isDeleted = true;
      msg.fileUrl = null;
      msg.fileName = null;
      msg.fileSize = null;
      await msg.save();
    }

    return expired.length;
  }
}

export default new MessageService();
