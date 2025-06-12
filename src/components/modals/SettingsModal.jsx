import React from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ darkMode }) => (darkMode ? '#222' : 'white')};
  color: ${({ darkMode }) => (darkMode ? 'white' : 'black')};
  padding: 1.5rem;
  border-radius: 8px;
  width: 400px;
`;

export default function SettingsModal({ darkMode, onClose, setDarkMode, notificationsEnabled, setNotificationsEnabled }) {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent darkMode={darkMode} onClick={e => e.stopPropagation()}>
        <h2>Paramètres</h2>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={e => setDarkMode(e.target.checked)}
          />
          Mode sombre
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={e => setNotificationsEnabled(e.target.checked)}
          />
          Notifications
        </label>
        <br /><br />
        <button onClick={onClose}>Fermer</button>
      </ModalContent>
    </ModalBackdrop>
  );
}
