import { IConversation } from '../../models';
import { IMessage } from '../../models';
import { IUser } from '../../models';

export interface IConversationWithLastMessage extends IConversation {
  lastMessage: IMessage | null;
  participants: Partial<IUser>[];
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
}

export interface IConversationListResponse {
  conversations: IConversationWithLastMessage[];
}

export interface IConversationResponse {
  conversation: IConversationWithLastMessage;
}
