import { ConversationType } from '../../../enums';

export type IConversation = {
  id: string;
  name: string | null;
  description: string | null;
  type: ConversationType;
  ephemeralDuration: number | null;
  createdAt?: string;
  updatedAt?: string;
};
