import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from '../components/Navbar';
import Chat from '../components/Chat';
import SettingsModal from '../components/modals/SettingsModal';
import ProfileModal from '../components/modals/ProfileModal';
import CreateModal from '../components/modals/CreateModal';
import InviteModal from '../components/modals/InviteModal';
import MembersModal from '../components/modals/MembersModal';
import EditWorkspaceModal from '../components/modals/EditWorkspaceModal';
import CreateChannelModal from '../features/channels/CreateChannelModal';
import Workspaces from '../components/Workspaces';

const API_URL = process.env.REACT_APP_API_URL;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Arial, sans-serif;
  }
`;

export default function DashboardPage() {
  const user = useSelector(state => state.auth.user);
  const token = localStorage.getItem('token');

  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [members, setMembers] = useState([]);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState([]);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [workspaceToEdit, setWorkspaceToEdit] = useState(null);

  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [error, setError] = useState(null);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Utilisateur non authentifié");
      setLoadingWorkspaces(false);
      return;
    }

    async function loadWorkspaces() {
      try {
        const res = await axios.get(`${API_URL}/workspaces/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkspaces(res.data || []);
        if (res.data && res.data.length > 0) {
          const firstWs = res.data[0];
          setSelectedWorkspaceId(firstWs.id);
          setSelectedChannelId(null);
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message || "Erreur inconnue");
      } finally {
        setLoadingWorkspaces(false);
      }
    }

    loadWorkspaces();
  }, [token]);

  useEffect(() => {
    if (!selectedWorkspaceId || !token) return;

    async function loadMembers() {
      try {
        const res = await axios.get(`${API_URL}/workspaces/${selectedWorkspaceId}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data || []);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || "Erreur inconnue");
      }
    }

    loadMembers();
  }, [selectedWorkspaceId, token]);

  const handleToggleWorkspace = async (id) => {
    const isExpanded = expandedWorkspaces.includes(id);
    const newExpanded = isExpanded
      ? expandedWorkspaces.filter(wsId => wsId !== id)
      : [...expandedWorkspaces, id];

    setExpandedWorkspaces(newExpanded);

    if (!isExpanded && token) {
      const targetWorkspace = workspaces.find(ws => ws.id === id);
      if (!targetWorkspace?.channels || targetWorkspace.channels.length === 0) {
        try {
          const res = await axios.get(`${API_URL}/channels/workspace/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWorkspaces(prev =>
            prev.map(ws =>
              ws.id === id ? { ...ws, channels: res.data } : ws
            )
          );
        } catch (err) {
          setError(err.response?.data?.detail || err.message || "Erreur chargement channels");
        }
      }
    }
  };

  const handleCreateWorkspace = async ({ name, description, isPublic }) => {
    setError(null);
    if (!token) {
      setError("Utilisateur non authentifié");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/workspaces/`,
        { name, description, is_public: isPublic },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWorkspaces(prev => [...prev, res.data]);
      setSelectedWorkspaceId(res.data.id);
      setSelectedChannelId(null);
      setShowCreateWorkspace(false);
    } catch (error) {
      setError(error.response?.data?.detail || error.message || "Erreur création workspace");
    }
  };

  const handleInvite = async email => {
    setError(null);
    if (!token || !workspaceToEdit) {
      setError("Action non autorisée");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/workspaces/${workspaceToEdit.id}/invite`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(`${API_URL}/workspaces/${workspaceToEdit.id}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data || []);
      setShowInviteModal(false);
    } catch (error) {
      setError(error.response?.data?.detail || error.message || "Erreur invitation");
    }
  };

  const handleLeave = async id => {
    setError(null);
    if (!token) {
      setError("Utilisateur non authentifié");
      return;
    }
    try {
      await axios.delete(`${API_URL}/workspaces/${id}/leave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkspaces(prev => prev.filter(ws => ws.id !== id));
      if (selectedWorkspaceId === id) {
        setSelectedWorkspaceId(null);
        setSelectedChannelId(null);
      }
    } catch (error) {
      setError(error.response?.data?.detail || error.message || "Erreur leave workspace");
    }
  };

  const handleUpdateWorkspace = updatedWorkspace => {
    setWorkspaces(prev =>
      prev.map(ws => (ws.id === updatedWorkspace.id ? updatedWorkspace : ws))
    );
    setShowEditModal(false);
  };

  const openCreateChannelModal = workspaceId => {
    setSelectedWorkspaceId(workspaceId);
    setShowCreateChannel(true);
  };

  const handleCreateChannel = async ({ name, description, is_private }) => {
    setError(null);
    if (!token) {
      setError("Utilisateur non authentifié");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/channels/`,
        {
          name,
          description,
          is_private,
          workspace_id: selectedWorkspaceId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWorkspaces(prev =>
        prev.map(ws =>
          ws.id === selectedWorkspaceId
            ? { ...ws, channels: [...(ws.channels || []), res.data] }
            : ws
        )
      );

      setSelectedChannelId(res.data.id);
      setShowCreateChannel(false);
    } catch (error) {
      setError(error.response?.data?.detail || error.message || "Erreur création canal");
    }
  };

  const handleSelect = (workspaceId, channelId = null) => {
    setSelectedWorkspaceId(workspaceId);
    setSelectedChannelId(channelId);
  };

  if (loadingWorkspaces) return <div>Chargement...</div>;

  return (
    <>
      <GlobalStyle />
      <Navbar
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {error && <ErrorBanner>{typeof error === 'object' ? JSON.stringify(error) : error}</ErrorBanner>}

      {showSettingsModal && (
        <SettingsModal
          darkMode={darkMode}
          onClose={() => setShowSettingsModal(false)}
          setDarkMode={setDarkMode}
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
        />
      )}

      {showProfileModal && <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />}
      {showCreateWorkspace && (
        <CreateModal
          onCreateSuccess={handleCreateWorkspace}
          onClose={() => setShowCreateWorkspace(false)}
        />
      )}
      {workspaceToEdit && showInviteModal && (
        <InviteModal
          workspace={workspaceToEdit}
          onInvite={handleInvite}
          onClose={() => setShowInviteModal(false)}
        />
      )}
      {showMembersModal && (
        <MembersModal
          workspaceId={selectedWorkspaceId}
          members={members}
          onChangeRole={() => {}}
          onRemoveMember={() => {}}
          onClose={() => setShowMembersModal(false)}
        />
      )}
      {workspaceToEdit && showEditModal && (
        <EditWorkspaceModal
          workspace={workspaceToEdit}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateWorkspace}
        />
      )}
      {showCreateChannel && (
        <CreateChannelModal
          onCreateChannel={handleCreateChannel}
          onClose={() => setShowCreateChannel(false)}
          workspaceId={selectedWorkspaceId}
        />
      )}

      <Container>
        <Workspaces
          workspaces={workspaces}
          selectedWorkspaceId={selectedWorkspaceId}
          selectedChannelId={selectedChannelId}
          expandedWorkspaces={expandedWorkspaces}
          onToggle={handleToggleWorkspace}
          onSelect={handleSelect}
          onCreateWorkspace={() => setShowCreateWorkspace(true)}
          onInvite={ws => {
            setWorkspaceToEdit(ws);
            setShowInviteModal(true);
          }}
          onInfo={ws => {
            setSelectedWorkspaceId(ws.id);
            setShowMembersModal(true);
          }}
          onLeave={handleLeave}
          onEdit={ws => {
            setWorkspaceToEdit(ws);
            setShowEditModal(true);
          }}
          onCreateChannel={openCreateChannelModal}
          darkMode={darkMode}
        />

        <Chat
          channels={workspaces.find(ws => ws.id === selectedWorkspaceId)?.channels || []}
          channelId={selectedChannelId}
          onCreateChannelClick={() => setShowCreateChannel(true)}
          workspaceId={selectedWorkspaceId}
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  height: calc(100vh - 56px);
`;

const ErrorBanner = styled.div`
  background-color: #ffdddd;
  color: #a33;
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #a33;
  border-radius: 4px;
  font-weight: bold;
`;
