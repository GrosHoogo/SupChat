import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import { FaCog, FaUserCircle, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Global Styles for dark/light mode
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ darkMode }) => (darkMode ? '#121212' : '#f5f6fa')};
    color: ${({ darkMode }) => (darkMode ? '#eee' : '#222')};
    margin: 0;
    font-family: Arial, sans-serif;
  }
`;

// Styled components (some simplified for brevity)
const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

// Navbar
const NavbarContainer = styled.div`
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
const Sidebar = styled.div`
  width: 280px;
  background: ${({ darkMode }) => (darkMode ? '#20232a' : '#ecf0f1')};
  color: ${({ darkMode }) => (darkMode ? 'white' : '#2c3e50')};
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
    selected ? (darkMode ? '#3a3f58' : '#3498db') : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ darkMode, selected }) => (selected ? 'white' : darkMode ? 'white' : '#2c3e50')};

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#3a3f58' : '#bdc3c7')};
  }
`;

const ChannelList = styled.ul`
  list-style: none;
  padding-left: 1rem;
  margin-top: 0.2rem;
  margin-bottom: 1rem;
`;

const ChannelItem = styled.li`
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
const ChatArea = styled.div`
  flex: 1;
  background: ${({ darkMode }) => (darkMode ? '#1e1e1e' : 'white')};
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  background: ${({ darkMode }) => (darkMode ? '#292929' : '#fafafa')};
  border-radius: 6px;
  padding: 1rem;
  overflow-y: auto;
`;

const ChatInputWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.7rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const SendButton = styled.button`
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
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3);
  z-index: 1000;
`;

const ModalContent = styled.div`
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

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SwitchInput = styled.input`
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

// Settings Modal with dark mode + notifications toggle
function SettingsModal({ onClose, darkMode, setDarkMode, notificationsEnabled, setNotificationsEnabled }) {
  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <ModalContent darkMode={darkMode} onClick={e => e.stopPropagation()}>
        <h2>Paramètres</h2>

        <Label>
          Mode sombre
          <SwitchInput
            type="checkbox"
            checked={darkMode}
            onChange={e => setDarkMode(e.target.checked)}
          />
        </Label>

        <Label>
          Notifications
          <SwitchInput
            type="checkbox"
            checked={notificationsEnabled}
            onChange={e => setNotificationsEnabled(e.target.checked)}
          />
        </Label>

        <button onClick={onClose} style={{marginTop: '1rem', padding: '0.5rem 1rem'}}>
          Fermer
        </button>
      </ModalContent>
    </>
  );
}

// Profile Modal
function ProfileModal({ onClose, user }) {
  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>Profil</h2>
        <p><strong>Nom :</strong> {user.name}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <button onClick={() => alert('Exportation des données déclenchée')}>Exporter mes données (RGPD)</button>
        <button onClick={onClose} style={{marginTop:'1rem'}}>Fermer</button>
      </ModalContent>
    </>
  );
}

// Create Modal for Workspaces/Channels
function CreateModal({ title, onClose, onSubmit, fields, darkMode }) {
  const [formData, setFormData] = useState(fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === 'checkbox' ? false : '' }), {}));

  const handleChange = e => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <ModalContent darkMode={darkMode} onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map(({ label, name, type }) => (
            <div key={name} style={{ marginBottom: '1rem' }}>
              <label>
                {label}
                {type === 'checkbox' ? (
                  <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} style={{marginLeft: '1rem'}} />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    style={{marginLeft: '0.5rem', width: '100%'}}
                  />
                )}
              </label>
            </div>
          ))}
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Créer</button>
        </form>
      </ModalContent>
    </>
  );
}

// Invite Modal
function InviteModal({ onClose, onInvite, darkMode }) {
  const [email, setEmail] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!email) return;
    onInvite(email);
    setEmail('');
    onClose();
  };

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <ModalContent darkMode={darkMode} onClick={e => e.stopPropagation()}>
        <h2>Inviter un utilisateur</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Adresse email:
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{marginLeft: '0.5rem', width: '100%', marginTop: '0.5rem'}}
              placeholder="exemple@domaine.com"
            />
          </label>
          <button type="submit" style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Envoyer l'invitation</button>
        </form>
      </ModalContent>
    </>
  );
}

export default function DashboardPage() {
  const user = useSelector(state => state.auth.user) || { name: 'Alice Dupont', email: 'alice@example.com' };
  

  // Workspaces: each workspace has id, name, channels (array of {id, name})
  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: 'Workspace 1', channels: [{ id: 1, name: 'Général' }, { id: 2, name: 'Random' }] },
    { id: 2, name: 'Workspace 2', channels: [{ id: 3, name: 'Salons' }] },
  ]);

  // UI states
  const [expandedWorkspaces, setExpandedWorkspaces] = useState([]); // array of workspace ids expanded
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaces[0]?.id || null);
  const [selectedChannelId, setSelectedChannelId] = useState(workspaces[0]?.channels[0]?.id || null);

  const [messages, setMessages] = useState([
    { id: 1, text: 'Bienvenue dans le chat !', sender: 'System', workspaceId: 1, channelId: 1 },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Profile
  const [showProfile, setShowProfile] = useState(false);

  // Create modals
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Helpers
  const selectedWorkspace = workspaces.find(w => w.id === selectedWorkspaceId);
  const selectedChannel = selectedWorkspace?.channels.find(c => c.id === selectedChannelId);

  // Toggle workspace expand/collapse
  const toggleWorkspace = id => {
    setExpandedWorkspaces(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Send message handler
  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedWorkspaceId || !selectedChannelId) return;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text: chatInput,
        sender: user.name,
        workspaceId: selectedWorkspaceId,
        channelId: selectedChannelId,
      },
    ]);
    setChatInput('');
  };

  // Create workspace handler
  const handleCreateWorkspace = ({ name, isPublic }) => {
    const newWs = {
      id: Date.now(),
      name,
      isPublic,
      channels: [],
    };
    setWorkspaces(prev => [...prev, newWs]);
    setExpandedWorkspaces(prev => [...prev, newWs.id]);
    setSelectedWorkspaceId(newWs.id);
    setSelectedChannelId(null);
  };

  // Create channel handler
  const handleCreateChannel = ({ name }) => {
    if (!selectedWorkspace) return;
    const newChannel = { id: Date.now(), name };
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.id === selectedWorkspace.id
          ? { ...ws, channels: [...ws.channels, newChannel] }
          : ws
      )
    );
    setSelectedChannelId(newChannel.id);
  };

  // Invite handler (just mock alert for now)
  const handleInvite = email => {
    alert(`Invitation envoyée à ${email} pour rejoindre "${selectedWorkspace?.name}"`);
    // Ici tu pourrais appeler une API backend pour gérer la vraie invitation
  };

  // Filter messages for selected workspace & channel
  const filteredMessages = messages.filter(
    m => m.workspaceId === selectedWorkspaceId && m.channelId === selectedChannelId
  );

  return (
    <>
      <GlobalStyle darkMode={darkMode} />
      <PageWrapper>
        <NavbarContainer darkMode={darkMode}>
          <div>SupChat</div>
          <input type="text" placeholder="Rechercher un message..." style={{ flex: 1, margin: '0 1rem', padding: '0.5rem', borderRadius: '6px', border: 'none' }} />
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={() => setShowSettings(true)} title="Paramètres" style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.3rem', cursor: 'pointer' }}>
              <FaCog />
            </button>
            <button onClick={() => setShowProfile(true)} title="Profil" style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.3rem', cursor: 'pointer' }}>
              <FaUserCircle />
            </button>
          </div>
        </NavbarContainer>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar darkMode={darkMode}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <strong>Workspaces</strong>
              <button
                onClick={() => setShowCreateWorkspace(true)}
                title="Créer un workspace"
                style={{ background: 'none', border: 'none', color: darkMode ? 'white' : '#2c3e50', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <FaPlus />
              </button>
            </div>

            <WorkspaceList>
              {workspaces.map(ws => (
                <div key={ws.id} style={{ marginBottom: '1rem' }}>
                  <WorkspaceItem
                    selected={selectedWorkspaceId === ws.id}
                    darkMode={darkMode}
                    onClick={() => {
                      toggleWorkspace(ws.id);
                      setSelectedWorkspaceId(ws.id);
                      // If collapsed, reset selected channel to first channel or null
                      if (expandedWorkspaces.includes(ws.id)) {
                        setSelectedChannelId(null);
                      } else {
                        setSelectedChannelId(ws.channels[0]?.id || null);
                      }
                    }}
                  >
                    <span>{ws.name}</span>
                    {expandedWorkspaces.includes(ws.id) ? <FaChevronUp /> : <FaChevronDown />}
                  </WorkspaceItem>

                  {expandedWorkspaces.includes(ws.id) && (
                    <>
                      <ChannelList>
                        {ws.channels.map(ch => (
                          <ChannelItem
                            key={ch.id}
                            selected={selectedChannelId === ch.id}
                            darkMode={darkMode}
                            onClick={() => setSelectedChannelId(ch.id)}
                          >
                            # {ch.name}
                          </ChannelItem>
                        ))}
                      </ChannelList>

                      <button
                        onClick={() => {
                          setSelectedWorkspaceId(ws.id);
                          setShowCreateChannel(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: darkMode ? 'white' : '#2c3e50',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <FaPlus /> Nouveau salon
                      </button>

                      <button
                        onClick={() => {
                          setSelectedWorkspaceId(ws.id);
                          setShowInviteModal(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: darkMode ? 'white' : '#2c3e50',
                          cursor: 'pointer',
                          fontSize: '1rem',
                        }}
                      >
                        Inviter un utilisateur
                      </button>
                    </>
                  )}
                </div>
              ))}
            </WorkspaceList>
          </Sidebar>

          <ChatArea darkMode={darkMode}>
            <ChatHeader>
              {selectedWorkspace ? selectedWorkspace.name : 'Aucun workspace sélectionné'} {'>'} {selectedChannel ? `# ${selectedChannel.name}` : 'Aucun salon sélectionné'}
            </ChatHeader>
            <ChatMessages darkMode={darkMode}>
              {filteredMessages.length === 0 && <i>Aucun message</i>}
              {filteredMessages.map(m => (
                <p key={m.id}><strong>{m.sender}:</strong> {m.text}</p>
              ))}
            </ChatMessages>
            <ChatInputWrapper>
              <ChatInput
                darkMode={darkMode}
                type="text"
                placeholder="Écrire un message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              />
              <SendButton darkMode={darkMode} onClick={handleSendMessage} disabled={!chatInput.trim()}>
                Envoyer
              </SendButton>
            </ChatInputWrapper>
          </ChatArea>
        </div>

        {showSettings && (
          <SettingsModal
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}

        {showCreateWorkspace && (
          <CreateModal
            title="Créer un workspace"
            darkMode={darkMode}
            onClose={() => setShowCreateWorkspace(false)}
            onSubmit={handleCreateWorkspace}
            fields={[
              { label: 'Nom', name: 'name', type: 'text' },
              { label: 'Public', name: 'isPublic', type: 'checkbox' },
            ]}
          />
        )}

        {showCreateChannel && (
          <CreateModal
            title="Créer un salon"
            darkMode={darkMode}
            onClose={() => setShowCreateChannel(false)}
            onSubmit={handleCreateChannel}
            fields={[{ label: 'Nom', name: 'name', type: 'text' }]}
          />
        )}

        {showInviteModal && (
          <InviteModal
            darkMode={darkMode}
            onClose={() => setShowInviteModal(false)}
            onInvite={handleInvite}
          />
        )}
      </PageWrapper>
    </>
  );
}
