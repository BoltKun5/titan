import { ConversationType } from '../../../enums';

export type IConversation = {
  id: string;
  name: string | null;
  type: ConversationType;
  createdAt?: string;
  updatedAt?: string;
};
