import React, { useState, useRef, useCallback } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import './style.scss';

interface MessageInputProps {
  onSend: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
}) => {
  const [value, setValue] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    onTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
  };

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    onSend(trimmed);
    setValue('');
    onTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [value, onSend, onTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="MessageInput">
      <textarea
        className="MessageInput-field"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Message..."
        rows={1}
      />
      <IconButton
        className="MessageInput-send"
        onClick={handleSend}
        disabled={!value.trim()}
      >
        <SendIcon sx={{ color: value.trim() ? '#3b99f1' : '#666' }} />
      </IconButton>
    </div>
  );
};
