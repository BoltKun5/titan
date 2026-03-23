import { IMessage } from '../models';

export interface ServerToClientEvents {
  'message:new': (message: IMessage) => void;
  'message:typing': (data: { conversationId: string; userId: string; isTyping: boolean }) => void;
  'conversation:updated': (data: { conversationId: string }) => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  'message:send': (
    data: { conversationId: string; content: string },
    callback: (message: IMessage) => void,
  ) => void;
  'message:typing': (data: { conversationId: string; isTyping: boolean }) => void;
  'conversation:join': (data: { conversationId: string }) => void;
  'conversation:leave': (data: { conversationId: string }) => void;
  'message:read': (data: { conversationId: string }) => void;
}
