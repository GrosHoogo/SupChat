import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

// Navbar
export const NavbarContainer = styled.div`
  width: 100%;
  height: 60px;
  background-color: ${({ darkMode }) => (darkMode ? '#2c2f42' : '#2c3e50')};
  color: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  justify-content: space-between;
`;

// Sidebar
export const SidebarContainer = styled.div`
  width: 280px;
  background: ${({ darkMode }) => (darkMode ? '#20232a' : '#ecf0f1')};
  color: ${({ darkMode }) => (darkMode ? 'white' : '#2c3e50')};
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

// Workspace list
export const WorkspaceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const WorkspaceItem = styled.li`
  padding: 0.6rem;
  margin-bottom: 0.4rem;
  background-color: ${({ selected, darkMode }) =>
    selected ? (darkMode ? '#3a3f58' : '#3498db') : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ darkMode, selected }) => (selected ? 'white' : darkMode ? 'white' : '#2c3e50')};
  position: relative;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#3a3f58' : '#bdc3c7')};
  }
`;

export const WorkspaceName = styled.span`
  flex-grow: 1;
`;

export const SettingsIconWrapper = styled.div`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  color: ${({ darkMode }) => (darkMode ? 'white' : '#2c3e50')};
  font-size: 1.1rem;
  margin-left: 0.5rem;

  ${WorkspaceItem}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

export const ChannelList = styled.ul`
  list-style: none;
  padding-left: 1rem;
  margin-top: 0.2rem;
  margin-bottom: 1rem;
`;

export const ChannelItem = styled.li`
  padding: 0.4rem 0.8rem;
  margin-bottom: 0.2rem;
  background-color: ${({ selected, darkMode }) =>
    selected ? (darkMode ? '#555' : '#2980b9') : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  color: ${({ darkMode, selected }) => (selected ? 'white' : darkMode ? '#ddd' : '#2c3e50')};

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#666' : '#85c1e9')};
  }
`;

// Chat
export const ChatAreaContainer = styled.div`
  flex: 1;
  background: ${({ darkMode }) => (darkMode ? '#1e1e1e' : 'white')};
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

export const ChatHeader = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

export const ChatMessages = styled.div`
  flex: 1;
  background: ${({ darkMode }) => (darkMode ? '#292929' : '#fafafa')};
  border-radius: 6px;
  padding: 1rem;
  overflow-y: auto;
`;

export const ChatInputWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 0.7rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const SendButton = styled.button`
  margin-left: 0.5rem;
  background-color: ${({ darkMode }) => (darkMode ? '#3a3f58' : '#2c3e50')};
  color: white;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

// Modal styles
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3);
  z-index: 1000;
`;

export const ModalContent = styled.div`
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ darkMode }) => (darkMode ? '#333' : 'white')};
  color: ${({ darkMode }) => (darkMode ? '#eee' : '#222')};
  padding: 2rem;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 0 15px rgba(0,0,0,0.25);
  z-index: 1001;
`;

export const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const SwitchInput = styled.input`
  position: relative;
  width: 40px;
  height: 20px;
  appearance: none;
  background: #c6c6c6;
  outline: none;
  border-radius: 20px;
  transition: 0.3s;
  cursor: pointer;

  &:checked {
    background: #4f9eed;
  }

  &::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 18px;
    top: 1px;
    left: 1px;
    background: white;
    transform: translateX(0);
    transition: 0.3s;
  }

  &:checked::before {
    transform: translateX(20px);
  }
`;
