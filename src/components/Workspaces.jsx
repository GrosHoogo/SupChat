import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaUserFriends,
  FaSignOutAlt,
  FaUserCog,
  FaEdit,
  FaLock
} from 'react-icons/fa';

import { useTheme } from '../contexts/ThemeContext'; // <-- import du contexte

export default function Workspaces({
  workspaces,
  selectedWorkspaceId,
  selectedChannelId,
  expandedWorkspaces,
  onToggle,
  onSelect,
  onCreateWorkspace,
  onInvite,
  onInfo,
  onLeave,
  onEdit,
  onCreateChannel
}) {
  const { darkMode } = useTheme(); // <-- on récupère darkMode depuis le contexte

  const [pinnedChannelsByWorkspace, setPinnedChannelsByWorkspace] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [searchResults, setSearchResults] = useState({});

  const [publicWorkspaces, setPublicWorkspaces] = useState([]);
  const [loadingPublicWorkspaces, setLoadingPublicWorkspaces] = useState(false);
  const [errorPublicWorkspaces, setErrorPublicWorkspaces] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    expandedWorkspaces.forEach(wsId => {
      if (!pinnedChannelsByWorkspace[wsId]) {
        fetchPinnedChannels(wsId);
      }
    });
  }, [expandedWorkspaces]);

  useEffect(() => {
    if (!token) return;

    setLoadingPublicWorkspaces(true);
    axios.get('http://127.0.0.1:8000/workspaces/public', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setPublicWorkspaces(res.data);
        setErrorPublicWorkspaces(null);
      })
      .catch(err => {
        console.error("Erreur chargement workspaces publics:", err);
        setErrorPublicWorkspaces("Impossible de charger les workspaces publics");
      })
      .finally(() => {
        setLoadingPublicWorkspaces(false);
      });
  }, [token]);

  function fetchPinnedChannels(workspaceId) {
    if (!token) return;
    axios.get('http://127.0.0.1:8000/channels/channels/pinned', {
      params: { workspace_id: workspaceId },
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setPinnedChannelsByWorkspace(prev => ({
          ...prev,
          [workspaceId]: res.data
        }));
      })
      .catch(err => {
        console.error(`Erreur fetch pinned channels pour workspace ${workspaceId}:`, err);
        setPinnedChannelsByWorkspace(prev => ({
          ...prev,
          [workspaceId]: []
        }));
      });
  }

  function handleSearch(workspaceId, query) {
    setSearchTerms(prev => ({ ...prev, [workspaceId]: query }));

    if (query.length < 1 || !token) {
      setSearchResults(prev => ({ ...prev, [workspaceId]: [] }));
      return;
    }

    axios.get(`http://127.0.0.1:8000/channels/${workspaceId}/search`, {
      params: { query },
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSearchResults(prev => ({ ...prev, [workspaceId]: res.data }));
      })
      .catch(err => {
        console.error(`Erreur recherche canaux pour ${workspaceId}:`, err);
        setSearchResults(prev => ({ ...prev, [workspaceId]: [] }));
      });
  }

  function handleJoinWorkspace(workspaceId) {
    if (!token) return;

    axios.post(`http://127.0.0.1:8000/workspaces/${workspaceId}/join`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert("Rejoint le workspace avec succès !");
        // Optionnel : déclencher mise à jour des workspaces privés ou rechargement
      })
      .catch(err => {
        console.error("Erreur rejoindre workspace:", err);
        alert("Erreur lors de la tentative de rejoindre ce workspace.");
      });
  }

  return (
    <Container darkMode={darkMode}>
      <Header>Workspaces</Header>

      {workspaces.map(ws => {
        const isExpanded = expandedWorkspaces.includes(ws.id);
        const pinnedChannels = pinnedChannelsByWorkspace[ws.id] || [];
        const searchTerm = searchTerms[ws.id] || '';
        const searchRes = searchResults[ws.id] || [];

        return (
          <div key={ws.id}>
            <WorkspaceTitle
              onClick={() => onToggle(ws.id)}
              selected={selectedWorkspaceId === ws.id}
            >
              <div>
                {ws.name} {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              <Actions>
                <IconButton title="Inviter" onClick={e => {
                  e.stopPropagation();
                  onInvite(ws);
                }}>
                  <FaUserFriends />
                </IconButton>
                <IconButton title="Info" onClick={e => {
                  e.stopPropagation();
                  onInfo(ws);
                }}>
                  <FaUserCog />
                </IconButton>
                <IconButton title="Editer" onClick={e => {
                  e.stopPropagation();
                  onEdit(ws);
                }}>
                  <FaEdit />
                </IconButton>
                <IconButton title="Quitter" onClick={e => {
                  e.stopPropagation();
                  onLeave(ws.id);
                }}>
                  <FaSignOutAlt />
                </IconButton>
              </Actions>
            </WorkspaceTitle>

            {isExpanded && (
              <>
                {/* Champ de recherche */}
                <div style={{ margin: '0.5rem 1rem' }}>
                  <input
                    type="text"
                    placeholder="Rechercher un canal..."
                    value={searchTerm}
                    onChange={e => handleSearch(ws.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.3rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      backgroundColor: darkMode ? '#333' : '#fff',
                      color: darkMode ? '#eee' : '#000'
                    }}
                  />
                </div>

                {/* Résultats de recherche */}
                {searchRes.length > 0 && (
                  <ChannelList>
                    {searchRes.map(channel => (
                      <ChannelItem
                        key={channel.id}
                        selected={selectedChannelId === channel.id}
                        onClick={() => onSelect(ws.id, channel.id)}
                      >
                        🔍 # {channel.name}
                        {channel.is_private && <LockIcon title="Canal privé" />}
                      </ChannelItem>
                    ))}
                  </ChannelList>
                )}

                {/* Liste des canaux normaux */}
                <ChannelList>
                  {(ws.channels || []).map(channel => (
                    <ChannelItem
                      key={channel.id}
                      selected={selectedChannelId === channel.id}
                      onClick={() => onSelect(ws.id, channel.id)}
                    >
                      # {channel.name}
                      {channel.is_private && <LockIcon title="Canal privé" />}
                    </ChannelItem>
                  ))}
                </ChannelList>

                {/* Channels épinglés */}
                {pinnedChannels.length > 0 && (
                  <>
                    <PinnedHeader darkMode={darkMode}>Channels épinglés</PinnedHeader>
                    <PinnedList>
                      {pinnedChannels.map(channel => (
                        <PinnedItem
                          key={channel.id}
                          onClick={() => onSelect(ws.id, channel.id)}
                          selected={selectedChannelId === channel.id}
                        >
                          # {channel.name}
                          {channel.is_private && <LockIcon title="Canal privé" />}
                        </PinnedItem>
                      ))}
                    </PinnedList>
                  </>
                )}

                <AddChannelButton onClick={() => onCreateChannel(ws.id)}>
                  <FaPlus /> Ajouter un canal
                </AddChannelButton>
              </>
            )}
          </div>
        );
      })}

      <AddWorkspaceButton onClick={onCreateWorkspace}>
        <FaPlus /> Nouveau workspace
      </AddWorkspaceButton>

      {/* Section Workspaces publics */}
      <SectionTitle>Workspaces publics</SectionTitle>

      {loadingPublicWorkspaces && <p>Chargement des workspaces publics...</p>}
      {errorPublicWorkspaces && <p style={{ color: 'red' }}>{errorPublicWorkspaces}</p>}

      {publicWorkspaces.length === 0 && !loadingPublicWorkspaces && (
        <p>Aucun workspace public disponible.</p>
      )}

      {publicWorkspaces.map(ws => {
        const isJoined = workspaces.some(joinedWs => joinedWs.id === ws.id);
        return (
          <PublicWorkspaceItem key={ws.id} darkMode={darkMode}>
            <div>
              <strong>{ws.name}</strong><br />
              <small>{ws.description || 'Pas de description'}</small>
            </div>
            <JoinButton
              joined={isJoined}
              onClick={() => {
                if (!isJoined) handleJoinWorkspace(ws.id);
              }}
            >
              {isJoined ? "Rejoins" : "Rejoindre"}
            </JoinButton>
          </PublicWorkspaceItem>
        );
      })}

    </Container>
  );
}

// === STYLES ===

const Container = styled.div`
  width: 280px;
  background-color: ${props => (props.darkMode ? '#42465d' : '#f4f4f4')};
  color: ${props => (props.darkMode ? '#eee' : '#333')};
  border-right: 1px solid #ccc;
  padding: 1rem;
  overflow-y: auto;
`;

const Header = styled.h2`
  margin-top: 0;
`;

const WorkspaceTitle = styled.div`
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  margin: 0.3rem 0;
  display: flex;
  justify-content: space-between;
  background-color: ${props => (props.selected ? '#ddd' : 'transparent')};
  border-radius: 4px;
  align-items: center;

  &:hover {
    background-color: #ccc;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  padding: 2px;

  &:hover {
    color: #007bff;
  }
`;

const ChannelList = styled.ul`
  list-style: none;
  margin: 0.3rem 0 0.3rem 1rem;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
`;

const ChannelItem = styled.li`
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  border-radius: 3px;
  background-color: ${props => (props.selected ? '#ccc' : 'transparent')};

  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background-color: #bbb;
  }
`;

const LockIcon = styled(FaLock)`
  font-size: 0.8rem;
  color: #888;
`;

const AddChannelButton = styled.button`
  margin: 0.3rem 0 0.5rem 1rem;
  padding: 0.4rem 0.8rem;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;

  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background-color: #218838;
  }
`;

const AddWorkspaceButton = styled(AddChannelButton)`
  width: 90%;
  margin-top: 1rem;
  background-color: #007bff;

  &:hover {
    background-color: #0069d9;
  }
`;

const SectionTitle = styled.h3`
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`;

const PublicWorkspaceItem = styled.div`
  padding: 0.4rem 0.8rem;
  margin: 0.2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => (props.darkMode ? '#333' : '#eee')};
  border-radius: 4px;
`;

const JoinButton = styled.button`
  background-color: ${props => (props.joined ? '#6c757d' : '#007bff')};
  border: none;
  padding: 0.3rem 0.8rem;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.joined ? '#5a6268' : '#0056b3')};
  }
`;

const PinnedHeader = styled.div`
  font-weight: bold;
  margin: 0.5rem 0 0.3rem 1rem;
  color: ${props => (props.darkMode ? '#ddd' : '#444')};
`;

const PinnedList = styled.ul`
  list-style: none;
  padding-left: 1rem;
  margin: 0;
`;

const PinnedItem = styled.li`
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  background-color: ${props => (props.selected ? '#bbb' : 'transparent')};
  &:hover {
    background-color: #aaa;
  }
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;
