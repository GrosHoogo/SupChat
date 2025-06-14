import React, { useState } from 'react';
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

export default function CreateModal({ onClose, onCreateSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Token manquant. Merci de vous reconnecter.");
      return;
    }

    if (!name.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }

    setLoading(true);

    try {
      console.log("Création workspace:", { name, description, is_public: isPublic });

      const response = await axios.post(
        'http://localhost:8000/workspaces/',
        {
          name,
          description,
          is_public: isPublic,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      onCreateSuccess(response.data);
      onClose();
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.error("Erreur API détails:", err.response.data);
        setError(`Erreur API: ${err.response.status} ${err.response.statusText} - ${JSON.stringify(err.response.data)}`);
      } else {
        setError("Erreur réseau ou serveur inaccessible.");
      }
    }
  }

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>Créer un Workspace</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <label>
          Nom:
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <br />
        <label>
          Public:
          <input
            type="checkbox"
            checked={isPublic}
            onChange={e => setIsPublic(e.target.checked)}
          />
        </label>
        <br /><br />
        <button onClick={handleCreate} disabled={loading}>
          {loading ? 'Création...' : 'Créer'}
        </button>{' '}
        <button onClick={onClose} disabled={loading}>Annuler</button>
      </ModalContent>
    </ModalBackdrop>
  );
}
