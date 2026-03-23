import { Op } from 'sequelize';
import { ConversationType, IConversationWithLastMessage } from 'titan_core';
import {
  Conversation,
  ConversationParticipant,
  Message,
  User,
} from '../database';
import { Service } from '../core';

interface ParamsCreate {
  participantIds: string[];
  name?: string;
  type: ConversationType;
  creatorId: string;
}

class ConversationService extends Service {
  public async create(params: ParamsCreate): Promise<Conversation> {
    const { participantIds, name, type, creatorId } = params;

    // For direct conversations, check if one already exists between these two users
    if (type === ConversationType.DIRECT && participantIds.length === 1) {
      const existing = await this.findDirectConversation(
        creatorId,
        participantIds[0],
      );
      if (existing) {
        return existing;
      }
    }

    const conversation = await Conversation.create({
      name: name || null,
      type,
    });

    // Add creator + other participants
    const allParticipantIds = [
      creatorId,
      ...participantIds.filter((id) => id !== creatorId),
    ];
    await Promise.all(
      allParticipantIds.map((userId) =>
        ConversationParticipant.create({
          conversationId: conversation.id,
          userId,
        }),
      ),
    );

    this.logger.log(`Conversation ${conversation.id} created by ${creatorId}`);

    return conversation;
  }

  public async getUserConversations(
    userId: string,
  ): Promise<IConversationWithLastMessage[]> {
    const participations = await ConversationParticipant.findAll({
      where: { userId },
      attributes: ['conversationId', 'lastReadAt'],
    });

    const conversationIds = participations.map((p) => p.conversationId);
    if (conversationIds.length === 0) {
      return [];
    }

    const conversations = await Conversation.findAll({
      where: { id: { [Op.in]: conversationIds } },
      include: [
        {
          model: ConversationParticipant,
          include: [
            {
              model: User,
              attributes: ['id', 'shownName'],
            },
          ],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    const result: IConversationWithLastMessage[] = [];

    for (const conv of conversations) {
      const lastMessage = await Message.findOne({
        where: { conversationId: conv.id },
        order: [['createdAt', 'DESC']],
      });

      const participation = participations.find(
        (p) => p.conversationId === conv.id,
      );
      const unreadCount = participation?.lastReadAt
        ? await Message.count({
            where: {
              conversationId: conv.id,
              createdAt: { [Op.gt]: participation.lastReadAt },
              senderId: { [Op.ne]: userId },
            },
          })
        : await Message.count({
            where: {
              conversationId: conv.id,
              senderId: { [Op.ne]: userId },
            },
          });

      result.push({
        id: conv.id,
        name: conv.name,
        type: conv.type,
        createdAt: conv.getDataValue('createdAt' as any),
        updatedAt: conv.getDataValue('updatedAt' as any),
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              conversationId: lastMessage.conversationId,
              senderId: lastMessage.senderId,
              content: lastMessage.content,
              type: lastMessage.type,
              createdAt: lastMessage.getDataValue('createdAt' as any),
            }
          : null,
        participants: conv.participants.map((p) => ({
          id: p.user.id,
          shownName: p.user.shownName,
        })),
        unreadCount,
      });
    }

    return result;
  }

  public async isParticipant(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await ConversationParticipant.findOne({
      where: { conversationId, userId },
    });
    return !!participant;
  }

  public async markAsRead(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    await ConversationParticipant.update(
      { lastReadAt: new Date().toISOString() },
      { where: { conversationId, userId } },
    );
  }

  private async findDirectConversation(
    userId1: string,
    userId2: string,
  ): Promise<Conversation | null> {
    const conversations = await Conversation.findAll({
      where: { type: ConversationType.DIRECT },
      include: [{ model: ConversationParticipant }],
    });

    return (
      conversations.find((conv) => {
        const participantUserIds = conv.participants.map((p) => p.userId);
        return (
          participantUserIds.length === 2 &&
          participantUserIds.includes(userId1) &&
          participantUserIds.includes(userId2)
        );
      }) || null
    );
  }
}

export default new ConversationService();
