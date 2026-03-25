import React, { useState, useRef, useCallback } from 'react';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import { IconButton } from '@mui/material';
import './style.scss';

interface MessageInputProps {
  onSend: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  onFileUpload?: (file: File) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  onFileUpload,
}) => {
  const [value, setValue] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    if (e.target) e.target.value = '';
  };

  return (
    <div className="MessageInput">
      <input
        type="file"
        ref={imageInputRef}
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={handleFileChange}
      />
      <IconButton
        className="MessageInput-attach"
        onClick={() => imageInputRef.current?.click()}
        title="Envoyer une image"
      >
        <ImageIcon sx={{ color: '#888' }} />
      </IconButton>
      <IconButton
        className="MessageInput-attach"
        onClick={() => fileInputRef.current?.click()}
        title="Envoyer un fichier"
      >
        <AttachFileIcon sx={{ color: '#888' }} />
      </IconButton>
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
