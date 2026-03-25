import { Op, Sequelize } from 'sequelize';
import {
  ConversationType,
  IConversationWithLastMessage,
  ParticipantRole,
} from 'titan_core';
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
      description: null,
      type,
    });

    // Add creator as admin + other participants as members
    const allParticipantIds = [
      creatorId,
      ...participantIds.filter((id) => id !== creatorId),
    ];
    await Promise.all(
      allParticipantIds.map((userId) =>
        ConversationParticipant.create({
          conversationId: conversation.id,
          userId,
          role:
            userId === creatorId
              ? ParticipantRole.ADMIN
              : ParticipantRole.MEMBER,
        }),
      ),
    );

    this.logger.log(`Conversation ${conversation.id} created by ${creatorId}`);

    return conversation;
  }

  public async getUserConversations(
    userId: string,
    includeArchived = false,
  ): Promise<IConversationWithLastMessage[]> {
    const whereClause: Record<string, unknown> = { userId };
    if (!includeArchived) {
      whereClause.isArchived = false;
    }

    const participations = await ConversationParticipant.findAll({
      where: whereClause,
      attributes: [
        'conversationId',
        'lastReadAt',
        'isPinned',
        'isArchived',
        'isMuted',
      ],
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
              attributes: [
                'id',
                'shownName',
                'firstName',
                'lastName',
                'avatarUrl',
              ],
            },
          ],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    // Batch fetch last messages for all conversations in one query
    const lastMessages = await Message.findAll({
      where: { conversationId: { [Op.in]: conversationIds } },
      order: [['createdAt', 'DESC']],
      // Use a subquery approach: get the max createdAt per conversation
    });

    // Build a map of conversationId -> last message
    const lastMessageMap = new Map<string, Message>();
    for (const msg of lastMessages) {
      if (!lastMessageMap.has(msg.conversationId)) {
        lastMessageMap.set(msg.conversationId, msg);
      }
    }

    // Build participation map for lastReadAt and flags
    const participationMap = new Map(
      participations.map((p) => [
        p.conversationId,
        {
          lastReadAt: p.lastReadAt,
          isPinned: p.isPinned,
          isArchived: p.isArchived,
          isMuted: p.isMuted,
        },
      ]),
    );

    // Batch fetch unread counts using a grouped count query
    const unreadConditions = conversationIds.map((convId) => {
      const participation = participationMap.get(convId);
      const lastReadAt = participation?.lastReadAt;
      if (lastReadAt) {
        return {
          conversationId: convId,
          createdAt: { [Op.gt]: lastReadAt },
          senderId: { [Op.ne]: userId },
        };
      }
      return {
        conversationId: convId,
        senderId: { [Op.ne]: userId },
      };
    });

    // Single query for all unread counts grouped by conversationId
    const unreadResults = await Message.findAll({
      where: { [Op.or]: unreadConditions },
      attributes: [
        'conversationId',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      group: ['conversationId'],
      raw: true,
    });

    const unreadMap = new Map<string, number>(
      (
        unreadResults as unknown as { conversationId: string; count: string }[]
      ).map((r) => [r.conversationId, parseInt(r.count, 10)]),
    );

    const result = conversations.map((conv) => {
      const lastMessage = lastMessageMap.get(conv.id) || null;
      const participation = participationMap.get(conv.id);

      return {
        id: conv.id,
        name: conv.name,
        description: conv.description,
        type: conv.type,
        ephemeralDuration: conv.ephemeralDuration,
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
          avatarUrl: p.user.avatarUrl || null,
        })),
        unreadCount: unreadMap.get(conv.id) || 0,
        isPinned: participation?.isPinned ?? false,
        isArchived: participation?.isArchived ?? false,
        isMuted: participation?.isMuted ?? false,
      };
    });

    // Sort: pinned first, then by updatedAt
    result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return 0; // already sorted by updatedAt from DB
    });

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

  public async isAdmin(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await ConversationParticipant.findOne({
      where: { conversationId, userId, role: ParticipantRole.ADMIN },
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

  public async searchConversations(
    userId: string,
    query: string,
  ): Promise<IConversationWithLastMessage[]> {
    const allConversations = await this.getUserConversations(userId);
    const lowerQuery = query.toLowerCase();

    return allConversations.filter((conv) => {
      // Match conversation name
      if (conv.name && conv.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      // Match participant names
      if (
        conv.participants.some(
          (p) => p.shownName && p.shownName.toLowerCase().includes(lowerQuery),
        )
      ) {
        return true;
      }
      // Match last message content
      if (
        conv.lastMessage &&
        conv.lastMessage.content.toLowerCase().includes(lowerQuery)
      ) {
        return true;
      }
      return false;
    });
  }

  public async updateName(
    conversationId: string,
    name: string,
    userId: string,
  ): Promise<Conversation | null> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation || conversation.type !== ConversationType.GROUP) {
      return null;
    }

    const admin = await this.isAdmin(conversationId, userId);
    if (!admin) {
      return null;
    }

    conversation.name = name || null;
    await conversation.save();

    this.logger.log(
      `Conversation ${conversationId} renamed to "${name}" by ${userId}`,
    );
    return conversation;
  }

  public async updateDescription(
    conversationId: string,
    description: string,
    userId: string,
  ): Promise<Conversation | null> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation || conversation.type !== ConversationType.GROUP) {
      return null;
    }

    const admin = await this.isAdmin(conversationId, userId);
    if (!admin) {
      return null;
    }

    conversation.description = description || null;
    await conversation.save();

    this.logger.log(
      `Conversation ${conversationId} description updated by ${userId}`,
    );
    return conversation;
  }

  public async addParticipants(
    conversationId: string,
    participantIds: string[],
    addedByUserId: string,
  ): Promise<boolean> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation || conversation.type !== ConversationType.GROUP) {
      return false;
    }

    const admin = await this.isAdmin(conversationId, addedByUserId);
    if (!admin) {
      return false;
    }

    // Filter out existing participants
    const existingParticipants = await ConversationParticipant.findAll({
      where: { conversationId, userId: { [Op.in]: participantIds } },
      attributes: ['userId'],
    });
    const existingIds = new Set(existingParticipants.map((p) => p.userId));
    const newIds = participantIds.filter((id) => !existingIds.has(id));

    if (newIds.length === 0) {
      return true;
    }

    await Promise.all(
      newIds.map((userId) =>
        ConversationParticipant.create({ conversationId, userId }),
      ),
    );

    this.logger.log(
      `Added ${newIds.length} participants to conversation ${conversationId}`,
    );
    return true;
  }

  public async leaveConversation(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation || conversation.type !== ConversationType.GROUP) {
      return false;
    }

    const deleted = await ConversationParticipant.destroy({
      where: { conversationId, userId },
    });

    if (deleted > 0) {
      this.logger.log(`User ${userId} left conversation ${conversationId}`);
    }

    return deleted > 0;
  }

  public async togglePin(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await ConversationParticipant.findOne({
      where: { conversationId, userId },
    });
    if (!participant) return false;

    participant.isPinned = !participant.isPinned;
    await participant.save();
    return participant.isPinned;
  }

  public async toggleArchive(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await ConversationParticipant.findOne({
      where: { conversationId, userId },
    });
    if (!participant) return false;

    participant.isArchived = !participant.isArchived;
    await participant.save();
    return participant.isArchived;
  }

  public async toggleMute(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await ConversationParticipant.findOne({
      where: { conversationId, userId },
    });
    if (!participant) return false;

    participant.isMuted = !participant.isMuted;
    await participant.save();
    return participant.isMuted;
  }

  public async deleteConversation(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    // For the user, "delete" means removing themselves from the conversation
    const deleted = await ConversationParticipant.destroy({
      where: { conversationId, userId },
    });
    return deleted > 0;
  }

  public async setEphemeralDuration(
    conversationId: string,
    userId: string,
    duration: number | null,
  ): Promise<number | null> {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) return null;

    const admin = await this.isAdmin(conversationId, userId);
    if (!admin) return null;

    conversation.ephemeralDuration = duration;
    await conversation.save();

    this.logger.log(
      `Conversation ${conversationId} ephemeral duration set to ${duration}s by ${userId}`,
    );
    return duration;
  }

  private async findDirectConversation(
    userId1: string,
    userId2: string,
  ): Promise<Conversation | null> {
    // Find conversation IDs where both users are participants
    const participations1 = await ConversationParticipant.findAll({
      where: { userId: userId1 },
      attributes: ['conversationId'],
      raw: true,
    });
    const convIds1 = participations1.map((p) => p.conversationId);
    if (convIds1.length === 0) return null;

    const participations2 = await ConversationParticipant.findAll({
      where: {
        userId: userId2,
        conversationId: { [Op.in]: convIds1 },
      },
      attributes: ['conversationId'],
      raw: true,
    });
    const commonConvIds = participations2.map((p) => p.conversationId);
    if (commonConvIds.length === 0) return null;

    // Find the DIRECT conversation among the common ones
    const conversation = await Conversation.findOne({
      where: {
        id: { [Op.in]: commonConvIds },
        type: ConversationType.DIRECT,
      },
    });

    return conversation || null;
  }
}

export default new ConversationService();
