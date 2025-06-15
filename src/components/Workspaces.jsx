import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaUserFriends,
  FaSignOutAlt,
  FaUserCog,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

import { useTheme } from '../contexts/ThemeContext';
import {
  Container,
  Header,
  WorkspaceTitle,
  Actions,
  IconButton,
  ChannelList,
  ChannelItem,
  LockIcon,
  AddChannelButton,
  AddWorkspaceButton,
  SectionTitle,
  PublicWorkspaceItem,
  JoinButton,
  PinnedHeader,
  PinnedList,
  PinnedItem
} from './WorkspacesStyles';

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
  onCreateChannel,
  onDelete // Nouvelle prop pour gérer la suppression
}) {
  const { darkMode } = useTheme();

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

  function handleDeleteWorkspace(workspace) {
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer définitivement le workspace "${workspace.name}" ?\n\nCette action est irréversible et supprimera tous les canaux et messages associés.`
    );
    
    if (!confirmDelete) return;

    if (!token) {
      alert("Token manquant. Merci de vous reconnecter.");
      return;
    }

    axios.delete(`http://127.0.0.1:8000/workspaces/${workspace.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert("Workspace supprimé avec succès !");
        if (onDelete) {
          onDelete(workspace.id);
        }
      })
      .catch(err => {
        console.error("Erreur suppression workspace:", err);
        if (err.response) {
          alert(`Erreur lors de la suppression: ${err.response.status} - ${err.response.data?.detail || 'Erreur inconnue'}`);
        } else {
          alert("Erreur lors de la suppression du workspace.");
        }
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
                <IconButton 
                  title="Supprimer le workspace" 
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteWorkspace(ws);
                  }}
                  style={{ color: '#dc3545' }}
                >
                  <FaTrash />
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