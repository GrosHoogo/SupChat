import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 400px;
`;

const ErrorText = styled.div`
  color: red;
  margin-top: 0.5rem;
`;

export default function ProfileModal({ onClose }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [original, setOriginal] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Récupération des infos utilisateur
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
        setOriginal(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email);
      })
      .catch(() => {
        setError("Erreur lors du chargement du profil.");
      });
  }, [token]);

  // Sauvegarde des modifications
  const handleSave = () => {
    setError('');

    axios
      .put(
        'http://127.0.0.1:8000/users/me',
        {
          username,
          email,
          is_active: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        console.log('Profil mis à jour :', res.data);
        onClose();
      })
      .catch((err) => {
        if (err.response && err.response.data?.detail) {
          setError(
            Array.isArray(err.response.data.detail)
              ? err.response.data.detail[0]?.msg || 'Erreur de validation.'
              : 'Erreur lors de la mise à jour.'
          );
        } else {
          setError('Erreur réseau.');
        }
      });
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Profil</h2>

        <label>
          Nom d'utilisateur :
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </label>

        <label>
          Email :
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>

        {error && <ErrorText>{error}</ErrorText>}

        <br /><br />
        <button onClick={handleSave}>Sauvegarder</button>{' '}
        <button onClick={onClose}>Annuler</button>
      </ModalContent>
    </ModalBackdrop>
  );
}
