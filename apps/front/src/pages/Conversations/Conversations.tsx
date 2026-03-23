import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IConversationWithLastMessage } from 'titan_core';
import StoreContext from '../../hook/contexts/StoreContext';
import { loggedApi } from '../../axios';
import { ConversationListItem } from '../../components/ConversationListItem/ConversationListItem';
import { NewConversationModal } from '../../components/NewConversationModal/NewConversationModal';
import { Loader } from '../../components/UI/Loader/LoaderComponent';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';
import './style.scss';

export const Conversations: React.FC = () => {
  const [conversations, setConversations] = useState<
    IConversationWithLastMessage[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
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

  const handleConversationClick = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
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
      <div className="Conversations-list">
        {conversations.length === 0 ? (
          <div className="Conversations-empty">
            <p>Aucune conversation</p>
            <p>Commencez une nouvelle discussion !</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              currentUserId={user.id || ''}
              onClick={() => handleConversationClick(conversation.id)}
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
