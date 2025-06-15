import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { darkMode, setDarkMode } = useTheme();

  const [userData, setUserData] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [status, setStatus] = useState('en ligne');
  const [modalOpen, setModalOpen] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Chargement des données utilisateur depuis /auth/me
  useEffect(() => {
    if (!token) return;

    axios
      .get('http://127.0.0.1:8000/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        setError('Erreur lors du chargement des données RGPD.');
        console.error(err);
      });
  }, [token]);

  // Exporter les données RGPD
  const handleExportData = () => {
    if (!userData) return;

    const exportData = {
      username: userData.username,
      email: userData.email,
      created_at: userData.created_at,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'mes_donnees_personnelles.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!modalOpen) return null;

  return (
    <ModalBackdrop onClick={() => setModalOpen(false)}>
      <ModalContent darkMode={false} onClick={(e) => e.stopPropagation()}>
        <h2>Paramètres</h2>

        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          /> Mode sombre
        </label>

        <br />

        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
          /> Notifications
        </label>

        <br /><br />

        <label>
          Statut :
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="en ligne">En ligne</option>
            <option value="occupé">Occupé</option>
            <option value="hors ligne">Hors ligne</option>
          </select>
        </label>

        <br /><br />

        <button
          onClick={handleExportData}
          disabled={!userData}
        >
          Exporter mes données (RGPD)
        </button>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <br /><br />

        <button onClick={() => setModalOpen(false)}>Fermer</button>
      </ModalContent>
    </ModalBackdrop>
  );
}
