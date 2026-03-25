import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IMessage,
  IConversationWithLastMessage,
  IMessageReaction,
} from 'titan_core';
import StoreContext from '../../hook/contexts/StoreContext';
import { loggedApi } from '../../axios';
import { useSocket } from '../../hook/useSocket';
import { MessageBubble } from '../../components/MessageBubble/MessageBubble';
import { MessageInput } from '../../components/MessageInput/MessageInput';
import { Loader } from '../../components/UI/Loader/LoaderComponent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import SearchIcon from '@mui/icons-material/Search';
import {
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
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
  const [onlineStatus, setOnlineStatus] = useState<
    Map<string, { isOnline: boolean; lastSeen?: string }>
  >(new Map());
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IMessage[]>([]);
  const [forwardingMessage, setForwardingMessage] = useState<IMessage | null>(
    null,
  );
  const [allConversations, setAllConversations] = useState<
    IConversationWithLastMessage[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    connect,
    sendMessage,
    editMessage,
    deleteMessage,
    confirmDelivery,
    reactToMessage,
    forwardMessage,
    setTyping,
    markAsRead,
    onNewMessage,
    onMessageEdited,
    onMessageDeleted,
    onMessageStatus,
    onMessageReaction,
    onUserOnline,
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
        setMessages((prev) => {
          // Avoid duplicates (e.g. file upload returns via REST + socket)
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        markAsRead(conversationId);
        // Confirm delivery for messages from others
        if (message.senderId !== user.id) {
          confirmDelivery([message.id], conversationId);
        }
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

    const unsubEdited = onMessageEdited((message: IMessage) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? message : m)),
        );
      }
    });

    const unsubDeleted = onMessageDeleted((data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId
              ? { ...m, content: '', isDeleted: true }
              : m,
          ),
        );
      }
    });

    const unsubStatus = onMessageStatus((data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId ? { ...m, status: data.status } : m,
          ),
        );
      }
    });

    const unsubOnline = onUserOnline((data) => {
      setOnlineStatus((prev) => {
        const next = new Map(prev);
        next.set(data.userId, {
          isOnline: data.isOnline,
          lastSeen: data.lastSeen,
        });
        return next;
      });
    });

    const unsubReaction = onMessageReaction((data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== data.messageId) return m;
            const reactions = [...(m.reactions || [])];
            if (data.action === 'add' && data.reaction) {
              reactions.push(data.reaction);
            } else if (data.action === 'remove' && data.reaction) {
              const idx = reactions.findIndex(
                (r) => r.id === data.reaction!.id,
              );
              if (idx !== -1) reactions.splice(idx, 1);
            }
            return { ...m, reactions };
          }),
        );
      }
    });

    return () => {
      unsubMessage?.();
      unsubTyping?.();
      unsubEdited?.();
      unsubDeleted?.();
      unsubStatus?.();
      unsubOnline?.();
      unsubReaction?.();
    };
  }, [
    isConnected,
    conversationId,
    joinConversation,
    markAsRead,
    onNewMessage,
    onMessageEdited,
    onMessageDeleted,
    onMessageStatus,
    onMessageReaction,
    onUserOnline,
    onTyping,
    confirmDelivery,
    user.id,
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
      const message = await sendMessage(
        conversationId,
        content,
        replyingTo?.id,
      );
      setMessages((prev) => [...prev, message]);
      setReplyingTo(null);
      setTyping(conversationId, false);
    } catch (e) {
      // Fallback to REST if socket fails
      try {
        const response = await loggedApi.post(
          `/mimas/conversations/${conversationId}/messages`,
          { content, replyToId: replyingTo?.id },
        );
        setMessages((prev) => [...prev, response.data.message]);
        setReplyingTo(null);
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

  const handleEditMessage = async (messageId: string, content: string) => {
    try {
      const edited = await editMessage(messageId, content);
      setMessages((prev) => prev.map((m) => (m.id === edited.id ? edited : m)));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to edit message', e);
    }
  };

  const handleDeleteMessage = async (
    messageId: string,
    forEveryone: boolean,
  ) => {
    try {
      await deleteMessage(messageId, forEveryone);
      if (forEveryone) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, content: '', isDeleted: true } : m,
          ),
        );
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete message', e);
    }
  };

  const handleReply = (message: IMessage) => {
    setReplyingTo(message);
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const reaction = await reactToMessage(messageId, emoji);
      // Update local state
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m;
          const reactions = [...(m.reactions || [])];
          if (reaction) {
            // Added a reaction
            reactions.push(reaction);
          } else {
            // Removed — find and remove user's reaction with this emoji
            const idx = reactions.findIndex(
              (r) => r.userId === user.id && r.emoji === emoji,
            );
            if (idx !== -1) reactions.splice(idx, 1);
          }
          return { ...m, reactions };
        }),
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to react', e);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!conversationId) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await loggedApi.post(
        `/mimas/conversations/${conversationId}/messages/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      setMessages((prev) => [...prev, response.data.message]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to upload file', e);
    }
  };

  const handleForward = async (message: IMessage) => {
    try {
      const response = await loggedApi.get('/mimas/conversations');
      setAllConversations(
        response.data.conversations.filter(
          (c: IConversationWithLastMessage) => c.id !== conversationId,
        ),
      );
      setForwardingMessage(message);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load conversations for forward', e);
    }
  };

  const handleForwardTo = async (targetConversationId: string) => {
    if (!forwardingMessage) return;
    try {
      await forwardMessage(forwardingMessage.id, targetConversationId);
      setForwardingMessage(null);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to forward message', e);
    }
  };

  const getConversationDisplayName = (
    conv: IConversationWithLastMessage,
  ): string => {
    if (conv.name) return conv.name;
    const other = conv.participants.find(
      (p: Partial<{ id: string }>) => p.id !== user.id,
    );
    return other?.shownName || 'Conversation';
  };

  const getSenderName = (senderId: string) => {
    return conversation?.participants.find(
      (p: Partial<{ id: string }>) => p.id === senderId,
    )?.shownName;
  };

  const handleSearchMessages = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim() || !conversationId) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await loggedApi.get(
        `/mimas/conversations/${conversationId}/messages/search?q=${encodeURIComponent(
          query.trim(),
        )}`,
      );
      setSearchResults(response.data.messages);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to search messages', e);
    }
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
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

  const getPresenceSubtitle = () => {
    if (!conversation) return '';

    if (typingUsers.length > 0) {
      return "En train d'écrire...";
    }

    // For DMs, show online status of the other participant
    const otherParticipant = conversation.participants.find(
      (p: Partial<{ id: string }>) => p.id !== user.id,
    );
    if (!otherParticipant?.id) return '';

    const status = onlineStatus.get(otherParticipant.id);
    if (status?.isOnline) return 'En ligne';
    if (status?.lastSeen) {
      const date = new Date(status.lastSeen);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Vu à l'instant";
      if (diffMins < 60) return `Vu il y a ${diffMins} min`;

      return `Vu à ${date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }
    return '';
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
          {getPresenceSubtitle() && (
            <span
              className={`Chat-subtitle ${
                typingUsers.length > 0 ? 'Chat-typing' : 'Chat-presence'
              }`}
            >
              {getPresenceSubtitle()}
            </span>
          )}
        </div>
        <IconButton onClick={() => setShowSearch(!showSearch)}>
          <SearchIcon sx={{ color: '#fff' }} />
        </IconButton>
      </div>

      {showSearch && (
        <div className="Chat-searchBar">
          <TextField
            fullWidth
            size="small"
            placeholder="Rechercher dans la conversation..."
            value={searchQuery}
            onChange={(e) => handleSearchMessages(e.target.value)}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <CloseIcon
                    sx={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                    onClick={closeSearch}
                  />
                </InputAdornment>
              ),
            }}
          />
          {searchResults.length > 0 && (
            <div className="Chat-searchResults">
              {searchResults.map((msg) => (
                <div key={msg.id} className="Chat-searchResult">
                  <span className="Chat-searchResult-sender">
                    {getSenderName(msg.senderId) || 'Inconnu'}
                  </span>
                  <span className="Chat-searchResult-text">
                    {msg.content.length > 100
                      ? msg.content.substring(0, 100) + '...'
                      : msg.content}
                  </span>
                  <span className="Chat-searchResult-time">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleDateString('fr-FR')
                      : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="Chat-messages">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === user.id}
            senderName={getSenderName(message.senderId)}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
            onReply={handleReply}
            onReaction={handleReaction}
            onForward={handleForward}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {replyingTo && (
        <div className="Chat-replyBar">
          <ReplyIcon className="Chat-replyBar-icon" />
          <div className="Chat-replyBar-content">
            <span className="Chat-replyBar-sender">
              {replyingTo.senderId === user.id
                ? 'Vous'
                : getSenderName(replyingTo.senderId) || 'Inconnu'}
            </span>
            <span className="Chat-replyBar-text">
              {replyingTo.content.length > 80
                ? replyingTo.content.substring(0, 80) + '...'
                : replyingTo.content}
            </span>
          </div>
          <IconButton size="small" onClick={() => setReplyingTo(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      )}

      <MessageInput
        onSend={handleSendMessage}
        onTyping={handleTyping}
        onFileUpload={handleFileUpload}
      />

      <Dialog
        open={!!forwardingMessage}
        onClose={() => setForwardingMessage(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            bgcolor: '#1e1e2e',
            color: '#fff',
          },
        }}
      >
        <DialogTitle>Transférer le message</DialogTitle>
        <DialogContent>
          <List>
            {allConversations.map((conv) => (
              <ListItemButton
                key={conv.id}
                onClick={() => handleForwardTo(conv.id)}
              >
                <ListItemText primary={getConversationDisplayName(conv)} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
};
