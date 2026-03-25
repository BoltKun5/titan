import { ConversationType } from '../../../../enums';

export interface ICreateConversationBody {
  participantIds: string[];
  name?: string;
  description?: string;
  type: ConversationType;
}

export interface IUpdateConversationBody {
  name?: string;
  description?: string;
}

export interface IAddParticipantsBody {
  participantIds: string[];
}

export interface IGetConversationMessagesQuery {
  page?: number;
  limit?: number;
}
