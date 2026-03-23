import React from 'react';
import { IMessage, MessageType } from 'titan_core';
import './style.scss';

interface MessageBubbleProps {
  message: IMessage;
  isOwn: boolean;
  senderName?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  senderName,
}) => {
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (message.type === MessageType.SYSTEM) {
    return (
      <div className="MessageBubble MessageBubble--system">
        <span>{message.content}</span>
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
      <div className="MessageBubble-content">
        <p className="MessageBubble-text">{message.content}</p>
        <span className="MessageBubble-time">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};
