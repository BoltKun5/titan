import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  IMessage,
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
    (conversationId: string, content: string): Promise<IMessage> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          reject(new Error('Socket not connected'));
          return;
        }
        socketRef.current.emit(
          'message:send',
          { conversationId, content },
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
    setTyping,
    joinConversation,
    markAsRead,
    onNewMessage,
    onTyping,
    onConversationUpdated,
    isConnected,
    socket: socketRef.current,
  };
};
