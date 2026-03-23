import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMessage, IConversationWithLastMessage } from 'titan_core';
import StoreContext from '../../hook/contexts/StoreContext';
import { loggedApi } from '../../axios';
import { useSocket } from '../../hook/useSocket';
import { MessageBubble } from '../../components/MessageBubble/MessageBubble';
import { MessageInput } from '../../components/MessageInput/MessageInput';
import { Loader } from '../../components/UI/Loader/LoaderComponent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import './style.scss';

export const Chat: React.FC = () => {
  const { conversationId } = useParams<{
    conversationId: string;
  }>();
  const { user } = useContext(StoreContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversation, setConversation] =
    useState<IConversationWithLastMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    connect,
    sendMessage,
    setTyping,
    markAsRead,
    onNewMessage,
    onTyping,
    joinConversation,
    isConnected,
  } = useSocket();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, []);

  // Fetch conversation details and messages
  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const fetchData = async () => {
      try {
        const [convResponse, msgResponse] = await Promise.all([
          loggedApi.get('/mimas/conversations'),
          loggedApi.get(`/mimas/conversations/${conversationId}/messages`),
        ]);

        const conv = convResponse.data.conversations.find(
          (c: IConversationWithLastMessage) => c.id === conversationId,
        );
        setConversation(conv || null);
        setMessages(msgResponse.data.messages);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch chat data', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [conversationId]);

  // Connect socket and set up listeners
  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!isConnected || !conversationId) {
      return;
    }

    joinConversation(conversationId);
    markAsRead(conversationId);

    const unsubMessage = onNewMessage((message: IMessage) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
        markAsRead(conversationId);
      }
    });

    const unsubTyping = onTyping((data) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) =>
          data.isTyping
            ? [...prev.filter((id) => id !== data.userId), data.userId]
            : prev.filter((id) => id !== data.userId),
        );
      }
    });

    return () => {
      unsubMessage?.();
      unsubTyping?.();
    };
  }, [
    isConnected,
    conversationId,
    joinConversation,
    markAsRead,
    onNewMessage,
    onTyping,
  ]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) {
      return;
    }

    try {
      const message = await sendMessage(conversationId, content);
      setMessages((prev) => [...prev, message]);
      setTyping(conversationId, false);
    } catch (e) {
      // Fallback to REST if socket fails
      try {
        const response = await loggedApi.post(
          `/mimas/conversations/${conversationId}/messages`,
          { content },
        );
        setMessages((prev) => [...prev, response.data.message]);
      } catch (restError) {
        // eslint-disable-next-line no-console
        console.error('Failed to send message', restError);
      }
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (conversationId) {
      setTyping(conversationId, isTyping);
    }
  };

  const getConversationTitle = () => {
    if (!conversation) {
      return '';
    }
    if (conversation.name) {
      return conversation.name;
    }
    // For DMs, show the other participant's name
    const otherParticipant = conversation.participants.find(
      (p: Partial<{ id: string }>) => p.id !== user.id,
    );
    return otherParticipant?.shownName || 'Conversation';
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="Chat-Page">
      <div className="Chat-header">
        <IconButton
          onClick={() => navigate('/conversations')}
          className="Chat-backButton"
        >
          <ArrowBackIcon sx={{ color: '#fff' }} />
        </IconButton>
        <div className="Chat-headerInfo">
          <h3>{getConversationTitle()}</h3>
          {typingUsers.length > 0 && (
            <span className="Chat-typing">En train d&apos;écrire...</span>
          )}
        </div>
      </div>

      <div className="Chat-messages">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === user.id}
            senderName={
              conversation?.participants.find(
                (p: Partial<{ id: string }>) => p.id === message.senderId,
              )?.shownName
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSendMessage} onTyping={handleTyping} />
    </div>
  );
};
