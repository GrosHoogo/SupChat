import styled from 'styled-components';

export const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ darkMode }) => (darkMode ? '#35384A' : 'white')};
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#222')};
  padding: 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
`;

export const ButtonsGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ChannelName = styled.h3`
  font-size: 1.1rem;
  opacity: 0.8;
`;

export const EditButton = styled.button`
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

export const UpdateForm = styled.form`
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

export const Input = styled.input`
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ccc')};
  background-color: ${({ darkMode }) => (darkMode ? '#3a3e54' : 'white')};
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#222')};
  font-size: 0.9rem;
`;

export const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#222')};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

export const MessagesArea = styled.div`
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

export const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isCurrentUser }) => (isCurrentUser ? 'flex-end' : 'flex-start')};
  position: relative;
`;

export const UserName = styled.span`
  font-size: 0.85rem;
  margin-bottom: 0.2rem;
  opacity: 0.7;
`;

export const MessageBubble = styled.div`
  max-width: 60%;
  background-color: ${({ isCurrentUser, darkMode }) =>
    isCurrentUser
      ? darkMode ? '#4e548b' : '#d0d8ff'
      : darkMode ? '#3e4157' : '#e4e6ed'};
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#111')};
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  word-break: break-word;
  position: relative;
`;

export const MessageActions = styled.div`
  display: flex;
  gap: 0.3rem;
  background: ${({ darkMode }) => (darkMode ? '#3a3e54' : '#ffffff')};
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ddd')};
  border-radius: 8px;
  padding: 0.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  z-index: 5;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#4e548b' : '#e6e8f0')};
  }
`;

export const ReactionPicker = styled.div`
  position: absolute;
  top: -3rem;
  right: -1rem;
  background: ${({ darkMode }) => (darkMode ? '#3a3e54' : 'white')};
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ccc')};
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  gap: 0.3rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  z-index: 10;
`;

export const MessageReactions = styled.div`
  display: flex;
  gap: 0.3rem;
  margin-top: 0.3rem;
  align-self: ${({ isCurrentUser }) => (isCurrentUser ? 'flex-end' : 'flex-start')};
`;

export const ReactionItem = styled.span`
  background: ${({ darkMode }) => (darkMode ? '#4e548b' : '#e6e8f0')};
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#333')};
  padding: 0.2rem 0.4rem;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

export const InputArea = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: relative;
`;

export const MessageInput = styled.textarea`
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

export const SendButton = styled.button`
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

export const EmojiButton = styled.button`
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

export const EmojiPicker = styled.div`
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