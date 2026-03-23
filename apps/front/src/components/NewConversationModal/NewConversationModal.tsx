import React, { useState, useEffect } from 'react';
import { ConversationType } from 'titan_core';
import { loggedApi } from '../../axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import './style.scss';

interface NewConversationModalProps {
  onClose: () => void;
  onCreated: (conversationId: string) => void;
}

interface UserResult {
  id: string;
  shownName: string;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  onClose,
  onCreated,
}) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserResult[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (search.length < 1) {
        setUsers([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await loggedApi.get(
          `/user/search?q=${encodeURIComponent(search)}`,
        );
        setUsers(response.data.users || []);
      } catch {
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreate = async () => {
    if (selectedUsers.length === 0) {
      return;
    }
    setIsCreating(true);
    try {
      const isGroup = selectedUsers.length > 1;
      const response = await loggedApi.post('/mimas/conversations', {
        participantIds: selectedUsers,
        type: isGroup ? ConversationType.GROUP : ConversationType.DIRECT,
        name: isGroup ? groupName || undefined : undefined,
      });
      onCreated(response.data.conversation.id);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to create conversation', e);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      className="NewConversationModal"
    >
      <DialogTitle>Nouvelle conversation</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          margin="dense"
          size="small"
        />

        {selectedUsers.length > 1 && (
          <TextField
            fullWidth
            placeholder="Nom du groupe (optionnel)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            margin="dense"
            size="small"
          />
        )}

        <div className="NewConversationModal-results">
          {isLoading ? (
            <div className="NewConversationModal-loader">
              <CircularProgress size={24} />
            </div>
          ) : (
            <List dense>
              {users.map((u) => (
                <ListItem key={u.id} disablePadding>
                  <ListItemButton onClick={() => toggleUser(u.id)}>
                    <Checkbox
                      edge="start"
                      checked={selectedUsers.includes(u.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText primary={u.shownName} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={selectedUsers.length === 0 || isCreating}
        >
          {isCreating ? <CircularProgress size={20} /> : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
