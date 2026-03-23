import React from 'react';
import { IConversationWithLastMessage, ConversationType } from 'titan_core';
import './style.scss';

interface ConversationListItemProps {
  conversation: IConversationWithLastMessage;
  currentUserId: string;
  onClick: () => void;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  currentUserId,
  onClick,
}) => {
  const getDisplayName = () => {
    if (conversation.name) {
      return conversation.name;
    }
    if (conversation.type === ConversationType.DIRECT) {
      const other = conversation.participants.find(
        (p: Partial<{ id: string }>) => p.id !== currentUserId,
      );
      return other?.shownName || 'Utilisateur';
    }
    return conversation.participants
      .map((p: Partial<{ shownName: string }>) => p.shownName)
      .join(', ');
  };

  const getLastMessagePreview = () => {
    if (!conversation.lastMessage) {
      return 'Aucun message';
    }
    const prefix =
      conversation.lastMessage.senderId === currentUserId ? 'Vous: ' : '';
    const content = conversation.lastMessage.content;
    const truncated =
      content.length > 50 ? content.slice(0, 50) + '...' : content;
    return `${prefix}${truncated}`;
  };

  const getTimeLabel = () => {
    if (!conversation.lastMessage?.createdAt) {
      return '';
    }
    const date = new Date(conversation.lastMessage.createdAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const oneDay = 86400000;

    if (diff < oneDay && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (diff < oneDay * 2) {
      return 'Hier';
    }
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(' ')
      .map((w: string) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="ConversationListItem" onClick={onClick}>
      <div className="ConversationListItem-avatar">
        <span>{getInitials()}</span>
      </div>
      <div className="ConversationListItem-content">
        <div className="ConversationListItem-top">
          <span className="ConversationListItem-name">{getDisplayName()}</span>
          <span className="ConversationListItem-time">{getTimeLabel()}</span>
        </div>
        <div className="ConversationListItem-bottom">
          <span className="ConversationListItem-preview">
            {getLastMessagePreview()}
          </span>
          {conversation.unreadCount > 0 && (
            <span className="ConversationListItem-badge">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
