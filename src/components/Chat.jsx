import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import socket from '../api/socket';
import {
  ChatContainer,
  Header,
  ButtonsGroup,
  ChannelName,
  EditButton,
  UpdateForm,
  Input,
  CheckboxLabel,
  MessagesArea,
  MessageWrapper,
  UserName,
  MessageBubble,
  InputArea,
  MessageInput,
  SendButton,
  EmojiButton,
  EmojiPicker
} from './ChatStyles';

export default function Chat({ channelId, workspaceId, darkMode = false }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [channelName, setChannelName] = useState('');
  const bottomRef = useRef(null);
  const token = localStorage.getItem('token');

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (!token) return;
    axios.get('http://127.0.0.1:8000/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setCurrentUser(res.data)).catch(() => setCurrentUser(null));
  }, [token]);

  useEffect(() => {
    if (!channelId || !workspaceId || !token) return;
    axios.get(`http://127.0.0.1:8000/channels/workspace/${workspaceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const channels = res.data;
        const current = channels.find(c => c.id === channelId);
        setChannelName(current?.name || '');
        setEditName(current?.name || '');
      })
      .catch(() => {
        setChannelName('');
        setEditName('');
      });
  }, [channelId, workspaceId, token]);

  // Fonction pour vérifier si le channel est épinglé
  const checkIfChannelIsPinned = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/channels/channels/pinned?workspace_id=${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const pinnedChannels = response.data;
      const isCurrentChannelPinned = pinnedChannels.some(channel => channel.id === channelId);
      setIsPinned(isCurrentChannelPinned);
    } catch (error) {
      console.error('Erreur lors de la vérification du statut épinglé:', error);
    }
  };

  useEffect(() => {
    if (!channelId || !token) return;
    axios.get(`http://127.0.0.1:8000/channels/${channelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const channel = res.data;
      setEditName(channel.name || '');
      setEditDescription(channel.description || '');
      setEditIsPrivate(channel.is_private || false);
    }).catch(() => {
      setEditDescription('');
      setEditIsPrivate(false);
    });

    // Vérifier si le channel est épinglé
    if (workspaceId) {
      checkIfChannelIsPinned();
    }
  }, [channelId, token, workspaceId]);

  useEffect(() => {
    if (!channelId || !token) return;

    const fetchMessages = () => {
      axios
        .get(`http://127.0.0.1:8000/channels/${channelId}/messages?limit=100&offset=0`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          const sorted = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          setMessages(sorted);
        })
        .catch(console.error);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 500);
    return () => clearInterval(interval);
  }, [channelId, token]);

  useEffect(() => {
    if (!channelId || !token) return;
    socket.auth = { token };
    socket.connect();
    socket.emit('join_channel', { channel_id: channelId });

    const onNewMsg = msg => {
      if (msg.channel_id !== channelId) return;
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id)) return prev;
        return [...prev, msg].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      });
    };

    socket.on('new_message', onNewMsg);
    return () => {
      socket.off('new_message', onNewMsg);
      socket.disconnect();
    };
  }, [channelId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await axios.post(`http://127.0.0.1:8000/channels/${channelId}/messages`, {
        content: input,
        type: 'text',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInput('');
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour gérer le pin/unpin
  const handlePinToggle = async (shouldPin) => {
    try {
      if (shouldPin) {
        // Épingler le channel
        await axios.post(`http://127.0.0.1:8000/channels/${channelId}/pin`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Désépingler le channel
        await axios.delete(`http://127.0.0.1:8000/channels/${channelId}/unpin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error('Erreur lors du pin/unpin:', error);
      throw error; // Re-lancer l'erreur pour la gestion dans handleEditSubmit
    }
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      // D'abord, mettre à jour les informations de base du channel
      await axios.patch(`http://127.0.0.1:8000/channels/${channelId}`, {
        name: editName,
        description: editDescription,
        is_private: editIsPrivate,
        // Ne pas inclure is_pinned ici
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensuite, gérer le pin/unpin séparément
      await handlePinToggle(isPinned);
      
      setChannelName(editName);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour du channel');
    }
  };

  const handleDeleteChannel = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce channel ? Cette action est irréversible.')) {
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:8000/channels/${channelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Channel supprimé avec succès.');
      // Ajouter redirection ou autre comportement ici si besoin
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression du channel.');
    }
  };

  const currentUserId = currentUser?.id || currentUser?._id || null;

  return (
    <ChatContainer darkMode={darkMode}>
      <Header>
        <ChannelName>{channelName}</ChannelName>
        <ButtonsGroup>
          <EditButton darkMode={darkMode} onClick={() => setIsEditing(v => !v)}>
            ✏️
          </EditButton>
          <EditButton
            darkMode={darkMode}
            onClick={handleDeleteChannel}
            style={{ color: 'red' }}
            title="Supprimer le channel"
          >
            🗑️
          </EditButton>
        </ButtonsGroup>

        {isEditing && (
          <UpdateForm darkMode={darkMode} onSubmit={handleEditSubmit}>
            <label>
              Nom
              <Input
                darkMode={darkMode}
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
              />
            </label>
            <label>
              Description
              <Input
                darkMode={darkMode}
                type="text"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
              />
            </label>
            <CheckboxLabel darkMode={darkMode}>
              <input
                type="checkbox"
                checked={editIsPrivate}
                onChange={e => setEditIsPrivate(e.target.checked)}
              />
              Privé
            </CheckboxLabel>
            <CheckboxLabel darkMode={darkMode}>
              <input
                type="checkbox"
                checked={isPinned}
                onChange={e => setIsPinned(e.target.checked)}
              />
              Épinglé
            </CheckboxLabel>
            <SendButton darkMode={darkMode} type="submit">
              Enregistrer
            </SendButton>
          </UpdateForm>
        )}
      </Header>

      <MessagesArea darkMode={darkMode}>
        {messages.map(msg => {
          const isCurrentUser = currentUserId && String(msg.sender_id) === String(currentUserId);
          return (
            <MessageWrapper key={msg._id} isCurrentUser={isCurrentUser}>
              <UserName>{isCurrentUser ? 'Moi' : 'Utilisateur'}</UserName>
              <MessageBubble isCurrentUser={isCurrentUser} darkMode={darkMode}>
                {msg.content}
              </MessageBubble>
            </MessageWrapper>
          );
        })}
        <div ref={bottomRef} />
      </MessagesArea>

      <InputArea>
        <MessageInput
          darkMode={darkMode}
          rows={1}
          placeholder="Écris un message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* Bouton emoji à gauche du bouton envoyer */}
        <EmojiButton
          darkMode={darkMode}
          aria-label="Ouvrir le sélecteur emoji"
          onClick={() => setShowEmojiPicker(v => !v)}
          type="button"
        >
          😀
        </EmojiButton>

        <SendButton
          darkMode={darkMode}
          aria-label="Envoyer le message"
          onClick={handleSend}
          disabled={!input.trim()}
          type="button"
        >
          {/* Icône d'envoi (flèche) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </SendButton>

        {showEmojiPicker && (
          <EmojiPicker darkMode={darkMode}>
            {['😀','😁','😂','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗','😙','😚','🙂','🤗','🤔','😐'].map(emoji => (
              <EmojiButton
                key={emoji}
                darkMode={darkMode}
                type="button"
                onClick={() => {
                  setInput(input + emoji);
                  setShowEmojiPicker(false);
                }}
                aria-label={`Ajouter emoji ${emoji}`}
              >
                {emoji}
              </EmojiButton>
            ))}
          </EmojiPicker>
        )}
      </InputArea>
    </ChatContainer>
  );
}