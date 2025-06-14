import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 400px;
`;

export default function EditWorkspaceModal({ workspace, onClose, onUpdate }) {
  const [name, setName] = useState(workspace.name || '');
  const [description, setDescription] = useState(workspace.description || '');
  const [isPublic, setIsPublic] = useState(workspace.is_public || false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(workspace.name || '');
    setDescription(workspace.description || '');
    setIsPublic(workspace.is_public || false);
  }, [workspace]);

  async function handleSave() {
    setError(null);
    if (!name.trim()) {
      setError("Le nom est requis.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch(
        `http://localhost:8000/workspaces/${workspace.id}`,
        { name, description, is_public: isPublic },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setLoading(false);
      onUpdate(res.data);
      onClose();
    } catch (err) {
      setLoading(false);
      setError("Erreur lors de la mise à jour.");
      console.error(err);
    }
  }

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <h2>Modifier Workspace</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label>Nom :</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <br /><br />

        <label>Description :</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
        <br /><br />

        <label>Public :</label>
        <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
        <br /><br />

        <button onClick={handleSave} disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>{' '}
        <button onClick={onClose} disabled={loading}>Annuler</button>
      </Modal>
    </Backdrop>
  );
}
