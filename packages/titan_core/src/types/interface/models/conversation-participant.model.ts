import { ParticipantRole } from '../../../enums';

export type IConversationParticipant = {
  id: string;
  conversationId: string;
  userId: string;
  role: ParticipantRole;
  isPinned?: boolean;
  isArchived?: boolean;
  isMuted?: boolean;
  joinedAt?: string;
  lastReadAt?: string | null;
};
