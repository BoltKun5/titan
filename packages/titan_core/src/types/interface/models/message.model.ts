import { MessageType } from '../../../enums';
import { MessageStatus } from '../../../enums';
import { IMessageReaction } from './message-reaction.model';

export type IMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status?: MessageStatus;
  isEdited?: boolean;
  isDeleted?: boolean;
  replyToId?: string | null;
  replyTo?: IMessage | null;
  reactions?: IMessageReaction[];
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  expiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
