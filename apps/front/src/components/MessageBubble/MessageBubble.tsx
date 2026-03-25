import React, { useState } from 'react';
import { IMessage, MessageType, MessageStatus } from 'titan_core';
import { IconButton, Menu, MenuItem, TextField, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReplyIcon from '@mui/icons-material/Reply';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import './style.scss';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface MessageBubbleProps {
  message: IMessage;
  isOwn: boolean;
  senderName?: string;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string, forEveryone: boolean) => void;
  onReply?: (message: IMessage) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  onForward?: (message: IMessage) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  senderName,
  onEdit,
  onDelete,
  onReply,
  onReaction,
  onForward,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);

  // Group reactions by emoji
  const reactionGroups = (message.reactions || []).reduce((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = [];
    acc[r.emoji].push(r.userId);
    return acc;
  }, {} as Record<string, string[]>);

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStatusIcon = () => {
    if (!isOwn) return null;

    switch (message.status) {
      case MessageStatus.READ:
        return (
          <DoneAllIcon
            className="MessageBubble-statusIcon MessageBubble-statusIcon--read"
            sx={{ fontSize: 14 }}
          />
        );
      case MessageStatus.DELIVERED:
        return (
          <DoneAllIcon
            className="MessageBubble-statusIcon"
            sx={{ fontSize: 14 }}
          />
        );
      case MessageStatus.SENT:
      default:
        return (
          <DoneIcon
            className="MessageBubble-statusIcon"
            sx={{ fontSize: 14 }}
          />
        );
    }
  };

  const handleEdit = () => {
    setMenuAnchor(null);
    setIsEditing(true);
    setEditContent(message.content);
  };

  const handleEditConfirm = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleDeleteForEveryone = () => {
    setMenuAnchor(null);
    onDelete?.(message.id, true);
  };

  const handleDeleteForMe = () => {
    setMenuAnchor(null);
    onDelete?.(message.id, false);
  };

  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

  const renderMediaContent = () => {
    if (message.type === MessageType.IMAGE && message.fileUrl) {
      return (
        <div className="MessageBubble-media">
          <img
            src={`${apiUrl}${message.fileUrl}`}
            alt={message.fileName || 'Image'}
            className="MessageBubble-image"
            loading="lazy"
          />
        </div>
      );
    }

    if (message.type === MessageType.VIDEO && message.fileUrl) {
      return (
        <div className="MessageBubble-media">
          <video
            src={`${apiUrl}${message.fileUrl}`}
            controls
            className="MessageBubble-video"
          />
        </div>
      );
    }

    if (message.type === MessageType.AUDIO && message.fileUrl) {
      return (
        <div className="MessageBubble-media">
          <audio
            src={`${apiUrl}${message.fileUrl}`}
            controls
            className="MessageBubble-audio"
          />
        </div>
      );
    }

    if (message.type === MessageType.FILE && message.fileUrl) {
      const sizeLabel = message.fileSize
        ? message.fileSize > 1024 * 1024
          ? `${(message.fileSize / (1024 * 1024)).toFixed(1)} Mo`
          : `${(message.fileSize / 1024).toFixed(1)} Ko`
        : '';

      return (
        <div className="MessageBubble-file">
          <InsertDriveFileIcon className="MessageBubble-file-icon" />
          <div className="MessageBubble-file-info">
            <span className="MessageBubble-file-name">
              {message.fileName || 'Fichier'}
            </span>
            {sizeLabel && (
              <span className="MessageBubble-file-size">{sizeLabel}</span>
            )}
          </div>
          <a
            href={`${apiUrl}${message.fileUrl}`}
            download={message.fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="MessageBubble-file-download"
          >
            <DownloadIcon fontSize="small" />
          </a>
        </div>
      );
    }

    return null;
  };

  if (message.type === MessageType.SYSTEM) {
    return (
      <div className="MessageBubble MessageBubble--system">
        <span>{message.content}</span>
      </div>
    );
  }

  if (message.isDeleted) {
    return (
      <div
        className={`MessageBubble ${
          isOwn ? 'MessageBubble--own' : 'MessageBubble--other'
        }`}
      >
        <div className="MessageBubble-content MessageBubble-content--deleted">
          <p className="MessageBubble-text MessageBubble-text--deleted">
            <em>Message supprimé</em>
          </p>
          <span className="MessageBubble-time">
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`MessageBubble ${
        isOwn ? 'MessageBubble--own' : 'MessageBubble--other'
      }`}
    >
      {!isOwn && senderName && (
        <span className="MessageBubble-sender">{senderName}</span>
      )}
      {message.replyTo && (
        <div className="MessageBubble-replyPreview">
          <span className="MessageBubble-replyPreview-sender">
            {(message.replyTo as any)?.sender?.shownName || 'Inconnu'}
          </span>
          <span className="MessageBubble-replyPreview-text">
            {message.replyTo.isDeleted
              ? 'Message supprimé'
              : message.replyTo.content.length > 100
              ? message.replyTo.content.substring(0, 100) + '...'
              : message.replyTo.content}
          </span>
        </div>
      )}
      <div className="MessageBubble-content">
        {isEditing ? (
          <div className="MessageBubble-editing">
            <TextField
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              size="small"
              fullWidth
              autoFocus
              multiline
              maxRows={4}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEditConfirm();
                }
                if (e.key === 'Escape') {
                  handleEditCancel();
                }
              }}
            />
            <div className="MessageBubble-editActions">
              <IconButton size="small" onClick={handleEditConfirm}>
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleEditCancel}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        ) : (
          <>
            {renderMediaContent()}
            {message.type === MessageType.TEXT && (
              <p className="MessageBubble-text">{message.content}</p>
            )}
            <span className="MessageBubble-time">
              {formatTime(message.createdAt)}
              {message.isEdited && (
                <span className="MessageBubble-edited"> (modifié)</span>
              )}
              {renderStatusIcon()}
            </span>
          </>
        )}
        {isOwn && !isEditing && (
          <>
            <div className="MessageBubble-actions">
              <IconButton
                className="MessageBubble-menuBtn"
                size="small"
                onClick={(e) => setEmojiAnchor(e.currentTarget)}
              >
                <EmojiEmotionsIcon fontSize="small" />
              </IconButton>
              <IconButton
                className="MessageBubble-menuBtn"
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </div>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  onReply?.(message);
                }}
              >
                <ReplyIcon fontSize="small" sx={{ mr: 1 }} /> Répondre
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  onForward?.(message);
                }}
              >
                <ShortcutIcon fontSize="small" sx={{ mr: 1 }} /> Transférer
              </MenuItem>
              <MenuItem onClick={handleEdit}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Modifier
              </MenuItem>
              <MenuItem onClick={handleDeleteForEveryone}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Supprimer pour
                tous
              </MenuItem>
              <MenuItem onClick={handleDeleteForMe}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Supprimer pour
                moi
              </MenuItem>
            </Menu>
          </>
        )}
        {!isOwn && !isEditing && (
          <div className="MessageBubble-actions">
            <IconButton
              className="MessageBubble-menuBtn"
              size="small"
              onClick={(e) => setEmojiAnchor(e.currentTarget)}
            >
              <EmojiEmotionsIcon fontSize="small" />
            </IconButton>
            <IconButton
              className="MessageBubble-menuBtn"
              size="small"
              onClick={() => onReply?.(message)}
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
            <IconButton
              className="MessageBubble-menuBtn"
              size="small"
              onClick={() => onForward?.(message)}
            >
              <ShortcutIcon fontSize="small" />
            </IconButton>
          </div>
        )}
        <Menu
          anchorEl={emojiAnchor}
          open={Boolean(emojiAnchor)}
          onClose={() => setEmojiAnchor(null)}
        >
          <div className="MessageBubble-emojiPicker">
            {QUICK_EMOJIS.map((emoji) => (
              <span
                key={emoji}
                className="MessageBubble-emojiOption"
                onClick={() => {
                  setEmojiAnchor(null);
                  onReaction?.(message.id, emoji);
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </Menu>
      </div>
      {Object.keys(reactionGroups).length > 0 && (
        <div className="MessageBubble-reactions">
          {Object.entries(reactionGroups).map(([emoji, userIds]) => (
            <Tooltip key={emoji} title={`${userIds.length} réaction(s)`}>
              <span
                className={`MessageBubble-reactionBadge ${
                  userIds.includes(message.senderId)
                    ? 'MessageBubble-reactionBadge--own'
                    : ''
                }`}
                onClick={() => onReaction?.(message.id, emoji)}
              >
                {emoji} {userIds.length > 1 ? userIds.length : ''}
              </span>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
};
