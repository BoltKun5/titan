import { MessageType } from 'titan_core';
import { Message, User } from '../database';
import { Service } from '../core';

interface ParamsCreate {
  conversationId: string;
  senderId: string;
  content: string;
  type?: MessageType;
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
    const message = await Message.create({
      conversationId: params.conversationId,
      senderId: params.senderId,
      content: params.content,
      type: params.type || MessageType.TEXT,
    });

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
          attributes: ['id', 'shownName'],
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
}

export default new MessageService();
