import { MessageType } from '../../../enums';

export type IMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt?: string;
  updatedAt?: string;
};
