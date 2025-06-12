import React from 'react';
import styled from 'styled-components';
import { FaPlus, FaChevronDown, FaChevronUp, FaCog } from 'react-icons/fa';

const Sidebar = styled.div`
  width: 360px;
  background: ${({ darkMode }) => (darkMode ? '#35384A' : '#35384A')};
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#eee')};
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const WorkspaceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const WorkspaceItem = styled.li`
  padding: 0.6rem;
  margin-bottom: 0.4rem;
  background-color: ${({ selected, darkMode }) =>
    selected ? (darkMode ? '#3e4157' : '#7a7e9a') : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ darkMode, selected }) => (selected ? 'white' : darkMode ? '#ddd' : '#eee')};
  position: relative;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#51546f' : '#8a8eb0')};
  }
`;

const ChannelList = styled.ul`
  list-style: none;
  padding-left: 1rem;
  margin: 0.3rem 0 0 0;
`;

const ChannelItem = styled.li`
  padding: 0.4rem;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${({ selected, darkMode }) =>
    selected ? (darkMode ? '#575a7c' : '#767ba2') : 'transparent'};
  color: ${({ darkMode, selected }) => (selected ? 'white' : darkMode ? '#ddd' : '#eee')};

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#676a8c' : '#8f94ae')};
  }
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#eee')};
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  align-self: flex-start;

  &:hover {
    color: ${({ darkMode }) => (darkMode ? '#bbb' : '#ccc')};
  }
`;

const WorkspaceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function Workspaces({
  darkMode,
  workspaces,
  selectedWorkspaceId,
  selectedChannelId,
  expandedWorkspaces,
  toggleWorkspace,
  setSelectedWorkspaceId,
  setSelectedChannelId,
  setShowCreateWorkspace,
  setShowCreateChannel,
  setWorkspaceToEdit,
}) {
  return (
    <Sidebar darkMode={darkMode}>
      <WorkspaceHeader>
        <h3>Workspaces</h3>
        <AddButton darkMode={darkMode} onClick={() => setShowCreateWorkspace(true)} title="Créer un workspace">
          <FaPlus />
        </AddButton>
      </WorkspaceHeader>

      <WorkspaceList>
        {workspaces.map(ws => {
          const isExpanded = expandedWorkspaces.includes(ws.id);
          return (
            <div key={ws.id}>
              <WorkspaceItem
                darkMode={darkMode}
                selected={ws.id === selectedWorkspaceId}
                onClick={() => {
                  toggleWorkspace(ws.id);
                  setSelectedWorkspaceId(ws.id);
                  const firstChannel = ws.channels[0];
                  setSelectedChannelId(firstChannel ? firstChannel.id : null);
                }}
              >
                <span>{ws.name}</span>
                <div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setWorkspaceToEdit(ws);
                    }}
                    title="Modifier / Inviter"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#ddd' : '#eee' }}
                  >
                    <FaCog />
                  </button>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </WorkspaceItem>

              {isExpanded && ws.channels.length > 0 && (
                <>
                  <ChannelList>
                    {ws.channels.map(ch => (
                      <ChannelItem
                        key={ch.id}
                        darkMode={darkMode}
                        selected={ch.id === selectedChannelId}
                        onClick={() => setSelectedChannelId(ch.id)}
                      >
                        # {ch.name}
                      </ChannelItem>
                    ))}
                  </ChannelList>
                  <AddButton darkMode={darkMode} onClick={() => setShowCreateChannel(true)} title="Créer un salon">
                    <FaPlus /> Salon
                  </AddButton>
                </>
              )}
            </div>
          );
        })}
      </WorkspaceList>
    </Sidebar>
  );
}
