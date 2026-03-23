import { ConversationType } from '../../../../enums';

export interface ICreateConversationBody {
  participantIds: string[];
  name?: string;
  type: ConversationType;
}

export interface IGetConversationMessagesQuery {
  page?: number;
  limit?: number;
}
