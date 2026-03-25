import { IMessage, IMessageReaction } from '../models';
import { MessageStatus } from '../../../enums';

export interface ServerToClientEvents {
  'message:new': (message: IMessage) => void;
  'message:edited': (message: IMessage) => void;
  'message:deleted': (data: { messageId: string; conversationId: string }) => void;
  'message:status': (data: {
    messageId: string;
    conversationId: string;
    status: MessageStatus;
  }) => void;
  'message:typing': (data: { conversationId: string; userId: string; isTyping: boolean }) => void;
  'message:reaction': (data: {
    messageId: string;
    conversationId: string;
    reaction: IMessageReaction;
    action: 'add' | 'remove';
  }) => void;
  'conversation:updated': (data: { conversationId: string }) => void;
  'user:online': (data: { userId: string; isOnline: boolean; lastSeen?: string }) => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  'message:send': (
    data: {
      conversationId: string;
      content: string;
      type?: string;
      replyToId?: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
    },
    callback: (message: IMessage) => void,
  ) => void;
  'message:forward': (
    data: { messageId: string; targetConversationId: string },
    callback: (message: IMessage) => void,
  ) => void;
  'message:edit': (
    data: { messageId: string; content: string },
    callback: (message: IMessage) => void,
  ) => void;
  'message:delete': (
    data: { messageId: string; forEveryone: boolean },
    callback: (success: boolean) => void,
  ) => void;
  'message:delivered': (data: { messageIds: string[]; conversationId: string }) => void;
  'message:react': (
    data: { messageId: string; emoji: string },
    callback: (reaction: IMessageReaction | null) => void,
  ) => void;
  'message:typing': (data: { conversationId: string; isTyping: boolean }) => void;
  'conversation:join': (data: { conversationId: string }) => void;
  'conversation:leave': (data: { conversationId: string }) => void;
  'message:read': (data: { conversationId: string }) => void;
}
