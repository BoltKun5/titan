import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  IMessage,
  IMessageReaction,
  MessageStatus,
} from 'titan_core';

const SOCKET_URL = (() => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:10101/api';
  return apiUrl.replace(/\/api\/?$/, '');
})();

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const useSocket = () => {
  const socketRef = useRef<TypedSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token || socketRef.current?.connected) {
      return;
    }

    const socket: TypedSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current = socket;
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback(
    (
      conversationId: string,
      content: string,
      replyToId?: string,
    ): Promise<IMessage> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          reject(new Error('Socket not connected'));
          return;
        }
        socketRef.current.emit(
          'message:send',
          { conversationId, content, replyToId },
          (message: IMessage) => {
            resolve(message);
          },
        );
      });
    },
    [],
  );

  const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
    socketRef.current?.emit('message:typing', { conversationId, isTyping });
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('conversation:join', { conversationId });
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    socketRef.current?.emit('message:read', { conversationId });
  }, []);

  const editMessage = useCallback(
    (messageId: string, content: string): Promise<IMessage> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          reject(new Error('Socket not connected'));
          return;
        }
        socketRef.current.emit(
          'message:edit',
          { messageId, content },
          (message: IMessage) => {
            resolve(message);
          },
        );
      });
    },
    [],
  );

  const deleteMessage = useCallback(
    (messageId: string, forEveryone: boolean): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          reject(new Error('Socket not connected'));
          return;
        }
        socketRef.current.emit(
          'message:delete',
          { messageId, forEveryone },
          (success: boolean) => {
            resolve(success);
          },
        );
      });
    },
    [],
  );

  const onMessageEdited = useCallback(
    (handler: (message: IMessage) => void) => {
      socketRef.current?.on('message:edited', handler);
      return () => {
        socketRef.current?.off('message:edited', handler);
      };
    },
    [],
  );

  const onMessageDeleted = useCallback(
    (
      handler: (data: { messageId: string; conversationId: string }) => void,
    ) => {
      socketRef.current?.on('message:deleted', handler);
      return () => {
        socketRef.current?.off('message:deleted', handler);
      };
    },
    [],
  );

  const confirmDelivery = useCallback(
    (messageIds: string[], conversationId: string) => {
      socketRef.current?.emit('message:delivered', {
        messageIds,
        conversationId,
      });
    },
    [],
  );

  const onMessageStatus = useCallback(
    (
      handler: (data: {
        messageId: string;
        conversationId: string;
        status: MessageStatus;
      }) => void,
    ) => {
      socketRef.current?.on('message:status', handler);
      return () => {
        socketRef.current?.off('message:status', handler);
      };
    },
    [],
  );

  const reactToMessage = useCallback(
    (messageId: string, emoji: string): Promise<IMessageReaction | null> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          reject(new Error('Socket not connected'));
          return;
        }
        socketRef.current.emit(
          'message:react',
          { messageId, emoji },
          (reaction: IMessageReaction | null) => {
            resolve(reaction);
          },
        );
      });
    },
    [],
  );

  const forwardMessage = useCallback(
    (messageId: string, targetConversationId: string): Promise<IMessage> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          reject(new Error('Socket not connected'));
          return;
        }
        socketRef.current.emit(
          'message:forward',
          { messageId, targetConversationId },
          (message: IMessage) => {
            resolve(message);
          },
        );
      });
    },
    [],
  );

  const onMessageReaction = useCallback(
    (
      handler: (data: {
        messageId: string;
        conversationId: string;
        reaction: IMessageReaction | null;
        action: 'add' | 'remove';
      }) => void,
    ) => {
      socketRef.current?.on('message:reaction', handler);
      return () => {
        socketRef.current?.off('message:reaction', handler);
      };
    },
    [],
  );

  const onUserOnline = useCallback(
    (
      handler: (data: {
        userId: string;
        isOnline: boolean;
        lastSeen?: string;
      }) => void,
    ) => {
      socketRef.current?.on('user:online', handler);
      return () => {
        socketRef.current?.off('user:online', handler);
      };
    },
    [],
  );

  const onNewMessage = useCallback((handler: (message: IMessage) => void) => {
    socketRef.current?.on('message:new', handler);
    return () => {
      socketRef.current?.off('message:new', handler);
    };
  }, []);

  const onTyping = useCallback(
    (
      handler: (data: {
        conversationId: string;
        userId: string;
        isTyping: boolean;
      }) => void,
    ) => {
      socketRef.current?.on('message:typing', handler);
      return () => {
        socketRef.current?.off('message:typing', handler);
      };
    },
    [],
  );

  const onConversationUpdated = useCallback(
    (handler: (data: { conversationId: string }) => void) => {
      socketRef.current?.on('conversation:updated', handler);
      return () => {
        socketRef.current?.off('conversation:updated', handler);
      };
    },
    [],
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    sendMessage,
    editMessage,
    deleteMessage,
    confirmDelivery,
    reactToMessage,
    forwardMessage,
    setTyping,
    joinConversation,
    markAsRead,
    onNewMessage,
    onMessageEdited,
    onMessageDeleted,
    onMessageStatus,
    onMessageReaction,
    onUserOnline,
    onTyping,
    onConversationUpdated,
    isConnected,
    socket: socketRef.current,
  };
};
