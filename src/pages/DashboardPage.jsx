import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import SettingsModal from '../components/modals/SettingsModal';
import ProfileModal from '../components/modals/ProfileModal';
import CreateModal from '../components/modals/CreateModal';
import InviteModal from '../components/modals/InviteModal';
import Navbar from '../components/Navbar';
import Workspaces from '../components/Workspaces';
import Chat from '../components/Chat';

// Global styles (pas besoin de déplacer)
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ darkMode }) => (darkMode ? '#121212' : '#f5f6fa')};
    color: ${({ darkMode }) => (darkMode ? '#eee' : '#222')};
    margin: 0;
    font-family: Arial, sans-serif;
  }
`;

const colors = {
  light: {
    navbarBg: '#35384A',
    workspacesBg: '#35384A',
    chatBg: 'white',
    text: '#eee',
    textSecondary: '#ccc',
    border: '#4a4d6a',
  },
  dark: {
    navbarBg: '#35384A',
    workspacesBg: '#35384A',
    chatBg: '#2f3142',
    text: '#ddd',
    textSecondary: '#bbb',
    border: '#4a4d6a',
  }
};

const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: ${({ darkMode, colors }) =>
    darkMode ? colors.dark.chatBg : colors.light.chatBg};
  color: ${({ darkMode, colors }) =>
    darkMode ? colors.dark.text : colors.light.text};
`;

const NavbarWrapper = styled.div`
  background-color: ${({ darkMode, colors }) =>
    darkMode ? colors.dark.navbarBg : colors.light.navbarBg};
  color: ${({ darkMode, colors }) =>
    darkMode ? colors.dark.text : colors.light.text};
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const WorkspacesWrapper = styled.div`
  background-color: ${({ darkMode, colors }) =>
    darkMode ? colors.dark.workspacesBg : colors.light.workspacesBg};
  width: 250px;
  color: ${({ darkMode, colors }) =>
    darkMode ? colors.dark.text : colors.light.text};
  border-right: 1px solid ${({ darkMode, colors }) =>
    darkMode ? colors.dark.border : colors.light.border};
  overflow-y: auto;
`;

const ChatWrapper = styled.div`
  flex: 1;
  background-color: ${({ darkMode, colors }) =>
    darkMode ? colors.dark.chatBg : colors.light.chatBg};
  color: ${({ darkMode, colors }) =>
    darkMode ? colors.dark.text : colors.light.text};
  display: flex;
  flex-direction: column;
`;

export default function DashboardPage() {
  const user = useSelector(state => state.auth.user) || { name: 'Alice Dupont', email: 'alice@example.com' };

  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: 'Workspace 1', isPublic: true, channels: [{ id: 1, name: 'Général' }, { id: 2, name: 'Random' }] },
    { id: 2, name: 'Workspace 2', isPublic: false, channels: [{ id: 3, name: 'Salons' }] },
  ]);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaces[0].id);
  const [selectedChannelId, setSelectedChannelId] = useState(workspaces[0].channels[0].id);

  const [expandedWorkspaces, setExpandedWorkspaces] = useState([workspaces[0].id]);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  const [workspaceToEdit, setWorkspaceToEdit] = useState(null);

  // Functions for workspace expansion, creation, invitation, etc.
  const toggleWorkspace = id => {
    if (expandedWorkspaces.includes(id)) {
      setExpandedWorkspaces(expandedWorkspaces.filter(wid => wid !== id));
      if (selectedWorkspaceId === id) setSelectedChannelId(null);
    } else {
      setExpandedWorkspaces([...expandedWorkspaces, id]);
      if (!selectedWorkspaceId) {
        setSelectedWorkspaceId(id);
        const ws = workspaces.find(w => w.id === id);
        if (ws && ws.channels.length) setSelectedChannelId(ws.channels[0].id);
      }
    }
  };

  const handleCreateWorkspace = ({ name, isPublic }) => {
    const newWs = {
      id: workspaces.length + 1,
      name,
      isPublic,
      channels: [],
    };
    setWorkspaces([...workspaces, newWs]);
    setExpandedWorkspaces([...expandedWorkspaces, newWs.id]);
    setSelectedWorkspaceId(newWs.id);
    setSelectedChannelId(null);
  };

  const handleCreateChannel = ({ name }) => {
    if (!selectedWorkspaceId) return;
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.id === selectedWorkspaceId
          ? { ...ws, channels: [...ws.channels, { id: Date.now(), name }] }
          : ws
      )
    );
  };

  const handleInvite = email => {
    alert(`Invitation envoyée à ${email} pour rejoindre "${workspaceToEdit?.name}"`);
  };

  const handleTogglePublic = id => {
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.id === id ? { ...ws, isPublic: !ws.isPublic } : ws
      )
    );
  };

  // Chat state and send message
  const [chatMessage, setChatMessage] = useState('');
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    alert(`Message envoyé dans le channel ${selectedChannelId} : ${chatMessage}`);
    setChatMessage('');
  };

  const selectedWorkspace = workspaces.find(w => w.id === selectedWorkspaceId);
  const channels = selectedWorkspace?.channels || [];

  return (
    <>
      <GlobalStyle darkMode={darkMode} />
      <PageWrapper darkMode={darkMode} colors={colors}>

        <NavbarWrapper darkMode={darkMode} colors={colors}>
          <Navbar
            darkMode={darkMode}
            bgColor={darkMode ? colors.dark.navbarBg : colors.light.navbarBg}
            color={darkMode ? colors.dark.text : colors.light.text}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
          />
        </NavbarWrapper>

        <ContentWrapper>
          <WorkspacesWrapper darkMode={darkMode} colors={colors}>
            <Workspaces
              darkMode={darkMode}
              workspaces={workspaces}
              selectedWorkspaceId={selectedWorkspaceId}
              selectedChannelId={selectedChannelId}
              expandedWorkspaces={expandedWorkspaces}
              toggleWorkspace={toggleWorkspace}
              setSelectedWorkspaceId={setSelectedWorkspaceId}
              setSelectedChannelId={setSelectedChannelId}
              setShowCreateWorkspace={setShowCreateWorkspace}
              setShowCreateChannel={setShowCreateChannel}
              setWorkspaceToEdit={setWorkspaceToEdit}
            />
          </WorkspacesWrapper>

          <ChatWrapper darkMode={darkMode} colors={colors}>
            <Chat
              darkMode={darkMode}
              selectedWorkspace={selectedWorkspace}
              selectedChannelId={selectedChannelId}
              channels={channels}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              handleSendMessage={handleSendMessage}
            />
          </ChatWrapper>
        </ContentWrapper>

        {/* Modals */}
        {showSettingsModal && (
          <SettingsModal
            darkMode={darkMode}
            onClose={() => setShowSettingsModal(false)}
            setDarkMode={setDarkMode}
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
          />
        )}

        {showProfileModal && (
          <ProfileModal onClose={() => setShowProfileModal(false)} user={user} />
        )}

        {showCreateWorkspace && (
          <CreateModal
            title="Créer un workspace"
            onClose={() => setShowCreateWorkspace(false)}
            onSubmit={handleCreateWorkspace}
            fields={[
              { label: 'Nom du workspace', name: 'name', type: 'text' },
              { label: 'Public', name: 'isPublic', type: 'checkbox' },
            ]}
            darkMode={darkMode}
          />
        )}

        {showCreateChannel && (
          <CreateModal
            title="Créer un salon"
            onClose={() => setShowCreateChannel(false)}
            onSubmit={handleCreateChannel}
            fields={[{ label: 'Nom du salon', name: 'name', type: 'text' }]}
            darkMode={darkMode}
          />
        )}

        {workspaceToEdit && (
          <InviteModal
            darkMode={darkMode}
            workspace={workspaceToEdit}
            onClose={() => setWorkspaceToEdit(null)}
            onInvite={handleInvite}
            onTogglePublic={handleTogglePublic}
          />
        )}
      </PageWrapper>
    </>
  );
}
