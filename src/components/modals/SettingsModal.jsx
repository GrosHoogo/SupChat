import React, { useState } from 'react';
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

export default function SettingsModal() {
  // Simuler des données utilisateur
  const personalData = {
    username: 'JeanDupont',
    email: 'jean.dupont@example.com',
    created_at: '2023-01-15',
  };

  // Etats internes
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [status, setStatus] = useState('en ligne'); // en ligne, occupé, hors ligne
  const [modalOpen, setModalOpen] = useState(true);

  function handleExportData() {
    const exportData = {
      username: personalData.username,
      email: personalData.email,
      created_at: personalData.created_at,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'mes_donnees_personnelles.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!modalOpen) return null;

  return (
    <ModalBackdrop onClick={() => setModalOpen(false)}>
      <ModalContent darkMode={darkMode} onClick={e => e.stopPropagation()}>
        <h2>Paramètres</h2>

        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={e => setDarkMode(e.target.checked)}
          /> Mode sombre
        </label>

        <br />

        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={e => setNotificationsEnabled(e.target.checked)}
          /> Notifications
        </label>

        <br /><br />

        <label>
          Statut :
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="en ligne">En ligne</option>
            <option value="occupé">Occupé</option>
            <option value="hors ligne">Hors ligne</option>
          </select>
        </label>

        <br /><br />

        <button onClick={handleExportData}>Exporter mes données (RGPD)</button>

        <br /><br />

        <button onClick={() => setModalOpen(false)}>Fermer</button>
      </ModalContent>
    </ModalBackdrop>
  );
}
