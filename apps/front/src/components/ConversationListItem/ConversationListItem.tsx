import React, { useState } from 'react';
import { IConversationWithLastMessage, ConversationType } from 'titan_core';
import { Menu, MenuItem } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import ArchiveIcon from '@mui/icons-material/Archive';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DeleteIcon from '@mui/icons-material/Delete';
import './style.scss';

interface ConversationListItemProps {
  conversation: IConversationWithLastMessage;
  currentUserId: string;
  onClick: () => void;
  onTogglePin?: (conversationId: string) => void;
  onToggleArchive?: (conversationId: string) => void;
  onToggleMute?: (conversationId: string) => void;
  onDelete?: (conversationId: string) => void;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  currentUserId,
  onClick,
  onTogglePin,
  onToggleArchive,
  onToggleMute,
  onDelete,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ mouseX: e.clientX, mouseY: e.clientY });
  };
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
    <div
      className={`ConversationListItem ${
        conversation.isPinned ? 'ConversationListItem--pinned' : ''
      }`}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      <div className="ConversationListItem-avatar">
        <span>{getInitials()}</span>
      </div>
      <div className="ConversationListItem-content">
        <div className="ConversationListItem-top">
          <span className="ConversationListItem-name">
            {conversation.isPinned && (
              <PushPinIcon
                sx={{
                  fontSize: 14,
                  mr: 0.5,
                  verticalAlign: 'middle',
                  opacity: 0.6,
                }}
              />
            )}
            {getDisplayName()}
          </span>
          <span className="ConversationListItem-time">{getTimeLabel()}</span>
        </div>
        <div className="ConversationListItem-bottom">
          <span className="ConversationListItem-preview">
            {conversation.isMuted && (
              <VolumeOffIcon
                sx={{
                  fontSize: 14,
                  mr: 0.5,
                  verticalAlign: 'middle',
                  opacity: 0.5,
                }}
              />
            )}
            {getLastMessagePreview()}
          </span>
          {conversation.unreadCount > 0 && (
            <span className="ConversationListItem-badge">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
      <Menu
        open={!!contextMenu}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            setContextMenu(null);
            onTogglePin?.(conversation.id);
          }}
        >
          <PushPinIcon fontSize="small" sx={{ mr: 1 }} />
          {conversation.isPinned ? 'Désépingler' : 'Épingler'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setContextMenu(null);
            onToggleMute?.(conversation.id);
          }}
        >
          {conversation.isMuted ? (
            <VolumeUpIcon fontSize="small" sx={{ mr: 1 }} />
          ) : (
            <VolumeOffIcon fontSize="small" sx={{ mr: 1 }} />
          )}
          {conversation.isMuted ? 'Réactiver' : 'Muet'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setContextMenu(null);
            onToggleArchive?.(conversation.id);
          }}
        >
          <ArchiveIcon fontSize="small" sx={{ mr: 1 }} />
          {conversation.isArchived ? 'Désarchiver' : 'Archiver'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setContextMenu(null);
            onDelete?.(conversation.id);
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Supprimer
        </MenuItem>
      </Menu>
    </div>
  );
};
