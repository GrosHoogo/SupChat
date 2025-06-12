import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchMockMessages, sendMockMessage, reactToMockMessage } from '../mocks/mockChatApi';
import { FaSmile } from 'react-icons/fa';

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ darkMode }) => (darkMode ? '#35384A' : 'white')};
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#222')};
  padding: 1rem;
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
  position: relative;

  &:hover .reaction-icon {
    opacity: 1;
  }
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
  position: relative;
`;

const Reactions = styled.div`
  margin-top: 0.3rem;
  display: flex;
  gap: 0.3rem;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ReactionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font-size: 0.9rem;

  &:hover {
    opacity: 1;
  }
`;

const ReactionTrigger = styled.button`
  background: none;
  border: none;
  position: absolute;
  right: -25px;
  top: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: pointer;
  color: ${({ darkMode }) => (darkMode ? '#ccc' : '#444')};
  font-size: 1rem;
`;

const ReactionMenu = styled.div`
  position: absolute;
  top: -40px;
  right: ${({ isCurrentUser }) => (isCurrentUser ? '0' : 'auto')};
  left: ${({ isCurrentUser }) => (isCurrentUser ? 'auto' : '0')};
  display: flex;
  gap: 0.3rem;
  background: ${({ darkMode }) => (darkMode ? '#444' : '#fff')};
  border: 1px solid ${({ darkMode }) => (darkMode ? '#666' : '#ccc')};
  padding: 0.3rem 0.4rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  z-index: 1;
`;

const InputArea = styled.div`
  display: flex;
  gap: 0.5rem;
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
`;

const SendButton = styled.button`
  background-color: ${({ darkMode }) => (darkMode ? '#575a7c' : '#5a5e80')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#6a6e94' : '#737aa7')};
  }
`;

export default function Chat({ darkMode = false }) {
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [showReactionMenu, setShowReactionMenu] = useState(null);
  const currentUserId = 'user1';

  useEffect(() => {
    fetchMockMessages().then(setMessages);
  }, []);

  const handleSendMessage = async () => {
    const text = chatMessage.trim();
    if (!text) return;
    const newMessage = await sendMockMessage(currentUserId, text);
    setMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const handleReaction = async (msgId, emoji) => {
    const updatedMessage = await reactToMockMessage(msgId, emoji);
    setMessages(prev =>
      prev.map(m => (m.id === msgId ? updatedMessage : m))
    );
    setShowReactionMenu(null);
  };

  const getUserName = (userId) => userId === 'user1' ? 'Moi' : 'Utilisateur';

  return (
    <ChatContainer darkMode={darkMode}>
      <h2>Chat / #général</h2>

      <MessagesArea darkMode={darkMode}>
        {messages.length === 0 ? (
          <p>Aucun message...</p>
        ) : (
          messages.map(msg => {
            const isCurrentUser = msg.userId === currentUserId;
            return (
              <MessageWrapper key={msg.id} isCurrentUser={isCurrentUser}>
                <UserName>{getUserName(msg.userId)}</UserName>
                <MessageBubble isCurrentUser={isCurrentUser} darkMode={darkMode}>
                  {msg.text}
                  {msg.reactions.length > 0 && (
                    <Reactions>{msg.reactions.join(' ')}</Reactions>
                  )}
                  <ReactionTrigger
                    className="reaction-icon"
                    darkMode={darkMode}
                    onClick={() => setShowReactionMenu(prev => prev === msg.id ? null : msg.id)}
                  >
                    <FaSmile />
                  </ReactionTrigger>
                  {showReactionMenu === msg.id && (
                    <ReactionMenu darkMode={darkMode} isCurrentUser={isCurrentUser}>
                      {['👍', '❤️', '😂', '🎉'].map(r => (
                        <ReactionButton key={r} onClick={() => handleReaction(msg.id, r)}>
                          {r}
                        </ReactionButton>
                      ))}
                    </ReactionMenu>
                  )}
                </MessageBubble>
              </MessageWrapper>
            );
          })
        )}
      </MessagesArea>

      <InputArea>
        <MessageInput
          darkMode={darkMode}
          value={chatMessage}
          onChange={e => setChatMessage(e.target.value)}
          rows={2}
          placeholder="Tape ton message..."
        />
        <SendButton darkMode={darkMode} onClick={handleSendMessage}>
          Envoyer
        </SendButton>
      </InputArea>
    </ChatContainer>
  );
}
