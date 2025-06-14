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
  darkMode
}) {
  const [pinnedChannelsByWorkspace, setPinnedChannelsByWorkspace] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    expandedWorkspaces.forEach(wsId => {
      if (!pinnedChannelsByWorkspace[wsId]) {
        fetchPinnedChannels(wsId);
      }
    });
  }, [expandedWorkspaces]);

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
                    <PinnedHeader>Channels épinglés</PinnedHeader>
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
    </Container>
  );
}

// === STYLES ===

const Container = styled.div`
  width: 280px;
  background-color: ${props => (props.darkMode ? '#222' : '#f4f4f4')};
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
  width: 100%;
  margin-top: 1rem;
  background-color: #007bff;

  &:hover {
    background-color: #0069d9;
  }
`;

const PinnedHeader = styled.div`
  margin-left: 1rem;
  margin-top: 0.6rem;
  font-weight: bold;
  color: ${props => (props.darkMode ? '#ccc' : '#555')};
`;

const PinnedList = styled.ul`
  list-style: none;
  margin: 0.2rem 0 0.3rem 1rem;
  padding: 0;
  max-height: 100px;
  overflow-y: auto;
`;

const PinnedItem = styled(ChannelItem)`
  background-color: ${props => (props.selected ? '#bbb' : '#eee')};
  color: ${props => (props.selected ? '#000' : '#333')};

  &:hover {
    background-color: #ccc;
  }
`;
