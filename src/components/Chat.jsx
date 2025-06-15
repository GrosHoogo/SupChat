import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import socket from '../api/socket';

// Styled Components
const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ darkMode }) => (darkMode ? '#35384A' : 'white')};
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#222')};
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
`;

const ButtonsGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ChannelName = styled.h3`
  font-size: 1.1rem;
  opacity: 0.8;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#222')};
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#4e548b' : '#d0d8ff')};
  }
`;

const UpdateForm = styled.form`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ darkMode }) => (darkMode ? '#3a3e54' : 'white')};
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ccc')};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.3rem;
  z-index: 10;
  width: 240px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Input = styled.input`
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ccc')};
  background-color: ${({ darkMode }) => (darkMode ? '#3a3e54' : 'white')};
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#222')};
  font-size: 0.9rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#222')};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  background-color: ${({ darkMode }) => (darkMode ? '#272b3a' : '#f0f0f0')};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isCurrentUser }) => (isCurrentUser ? 'flex-end' : 'flex-start')};
`;

const UserName = styled.span`
  font-size: 0.85rem;
  margin-bottom: 0.2rem;
  opacity: 0.7;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  background-color: ${({ isCurrentUser, darkMode }) =>
    isCurrentUser
      ? darkMode ? '#4e548b' : '#d0d8ff'
      : darkMode ? '#3e4157' : '#e4e6ed'};
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#111')};
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  word-break: break-word;
`;

const InputArea = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const MessageInput = styled.textarea`
  flex: 1;
  resize: none;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ccc')};
  font-size: 1rem;
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#222')};
  background-color: ${({ darkMode }) => (darkMode ? '#3a3e54' : 'white')};
  outline: none;
  height: 40px;
`;

const SendButton = styled.button`
  background-color: ${({ darkMode }) => (darkMode ? '#575a7c' : '#5a5e80')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px; 
  width: 150px;  
  font-size: 1.3rem;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#6a6e94' : '#737aa7')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#222')};
  padding: 0 0.3rem;
  height: 40px;
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ darkMode }) => (darkMode ? '#fff' : '#555')};
  }
`;

const EmojiPicker = styled.div`
  position: absolute;
  bottom: 50px;
  right: 0;
  background: ${({ darkMode }) => (darkMode ? '#3a3e54' : 'white')};
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ccc')};
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  width: 200px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 20;
`;

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

  useEffect(() => {
    if (!channelId || !token) return;
    axios.get(`http://127.0.0.1:8000/channels/${channelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const channel = res.data;
      setEditName(channel.name || '');
      setEditDescription(channel.description || '');
      setEditIsPrivate(channel.is_private || false);
      setIsPinned(channel.is_pinned || false);
    }).catch(() => {
      setEditDescription('');
      setEditIsPrivate(false);
      setIsPinned(false);
    });
  }, [channelId, token]);

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

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      await axios.patch(`http://127.0.0.1:8000/channels/${channelId}`, {
        name: editName,
        description: editDescription,
        is_private: editIsPrivate,
        is_pinned: isPinned,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChannelName(editName);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
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
