import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IConversationWithLastMessage, IMessage } from 'titan_core';
import StoreContext from '../../hook/contexts/StoreContext';
import { loggedApi } from '../../axios';
import { ConversationListItem } from '../../components/ConversationListItem/ConversationListItem';
import { NewConversationModal } from '../../components/NewConversationModal/NewConversationModal';
import { Loader } from '../../components/UI/Loader/LoaderComponent';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Fab, InputAdornment, TextField, Tabs, Tab, Badge } from '@mui/material';
import './style.scss';

export const Conversations: React.FC = () => {
  const [conversations, setConversations] = useState<
    IConversationWithLastMessage[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    IConversationWithLastMessage[] | null
  >(null);
  const [globalMessageResults, setGlobalMessageResults] = useState<
    IMessage[] | null
  >(null);
  const [searchTab, setSearchTab] = useState(0);
  const { user } = useContext(StoreContext);
  const navigate = useNavigate();

  const fetchConversations = async () => {
    try {
      const response = await loggedApi.get('/mimas/conversations');
      setConversations(response.data.conversations);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch conversations', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(null);
      setGlobalMessageResults(null);
      return;
    }
    try {
      const [convResponse, msgResponse] = await Promise.all([
        loggedApi.get(
          `/mimas/conversations/search?q=${encodeURIComponent(query.trim())}`,
        ),
        loggedApi.get(
          `/mimas/conversations/messages/search?q=${encodeURIComponent(
            query.trim(),
          )}`,
        ),
      ]);
      setSearchResults(convResponse.data.conversations);
      setGlobalMessageResults(msgResponse.data.messages);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to search', e);
    }
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setGlobalMessageResults(null);
    setSearchTab(0);
  };

  const displayedConversations = searchResults ?? conversations;

  const handleConversationClick = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  };

  const handleTogglePin = async (conversationId: string) => {
    try {
      const response = await loggedApi.put(
        `/mimas/conversations/${conversationId}/pin`,
      );
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === conversationId
            ? { ...c, isPinned: response.data.isPinned }
            : c,
        );
        // Re-sort: pinned first
        updated.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return 0;
        });
        return updated;
      });
    } catch (e) {
      console.error('Failed to toggle pin', e);
    }
  };

  const handleToggleArchive = async (conversationId: string) => {
    try {
      await loggedApi.put(`/mimas/conversations/${conversationId}/archive`);
      // Remove from local list (archived conversations are hidden by default)
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    } catch (e) {
      console.error('Failed to toggle archive', e);
    }
  };

  const handleToggleMute = async (conversationId: string) => {
    try {
      const response = await loggedApi.put(
        `/mimas/conversations/${conversationId}/mute`,
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, isMuted: response.data.isMuted }
            : c,
        ),
      );
    } catch (e) {
      console.error('Failed to toggle mute', e);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await loggedApi.delete(`/mimas/conversations/${conversationId}`);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    } catch (e) {
      console.error('Failed to delete conversation', e);
    }
  };

  const handleNewConversation = () => {
    setShowNewModal(true);
  };

  const handleConversationCreated = (conversationId: string) => {
    setShowNewModal(false);
    navigate(`/chat/${conversationId}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="Conversations-Page">
      <div className="Conversations-header">
        <h2>Messages</h2>
      </div>
      <div className="Conversations-search">
        <TextField
          fullWidth
          size="small"
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <CloseIcon
                  sx={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                  onClick={clearSearch}
                />
              </InputAdornment>
            ) : null,
          }}
        />
      </div>
      {searchQuery && (
        <Tabs
          value={searchTab}
          onChange={(_, v) => setSearchTab(v)}
          variant="fullWidth"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.5)',
              minHeight: 36,
              fontSize: 13,
            },
            '& .Mui-selected': { color: '#fff' },
            '& .MuiTabs-indicator': { backgroundColor: '#7c4dff' },
          }}
        >
          <Tab label="Conversations" />
          <Tab label="Messages" />
        </Tabs>
      )}
      <div className="Conversations-list">
        {searchQuery && searchTab === 1 ? (
          // Global message search results
          globalMessageResults && globalMessageResults.length > 0 ? (
            globalMessageResults.map((msg) => (
              <div
                key={msg.id}
                className="Conversations-messageResult"
                onClick={() => navigate(`/chat/${msg.conversationId}`)}
              >
                <span className="Conversations-messageResult-sender">
                  {(msg as any).sender?.shownName || 'Inconnu'}
                </span>
                <span className="Conversations-messageResult-text">
                  {msg.content.length > 80
                    ? msg.content.substring(0, 80) + '...'
                    : msg.content}
                </span>
                <span className="Conversations-messageResult-time">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleDateString('fr-FR')
                    : ''}
                </span>
              </div>
            ))
          ) : (
            <div className="Conversations-empty">
              <p>Aucun message trouvé</p>
            </div>
          )
        ) : displayedConversations.length === 0 ? (
          <div className="Conversations-empty">
            {searchQuery ? (
              <p>Aucun résultat pour &quot;{searchQuery}&quot;</p>
            ) : (
              <>
                <p>Aucune conversation</p>
                <p>Commencez une nouvelle discussion !</p>
              </>
            )}
          </div>
        ) : (
          displayedConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              currentUserId={user.id || ''}
              onClick={() => handleConversationClick(conversation.id)}
              onTogglePin={handleTogglePin}
              onToggleArchive={handleToggleArchive}
              onToggleMute={handleToggleMute}
              onDelete={handleDeleteConversation}
            />
          ))
        )}
      </div>
      <Fab
        className="Conversations-fab"
        color="primary"
        onClick={handleNewConversation}
      >
        <AddIcon />
      </Fab>
      {showNewModal && (
        <NewConversationModal
          onClose={() => setShowNewModal(false)}
          onCreated={handleConversationCreated}
        />
      )}
    </div>
  );
};
