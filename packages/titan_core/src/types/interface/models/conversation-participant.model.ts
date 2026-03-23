export type IConversationParticipant = {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt?: string;
  lastReadAt?: string | null;
};
