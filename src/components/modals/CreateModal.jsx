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
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 400px;
`;

export default function CreateModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleCreate() {
    if (!title.trim()) return alert('Le titre est requis');
    onCreate({ title, description });
    onClose();
  }

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>Créer un nouvel élément</h2>
        <label>
          Titre :
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Description :
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <br /><br />
        <button onClick={handleCreate}>Créer</button>{' '}
        <button onClick={onClose}>Annuler</button>
      </ModalContent>
    </ModalBackdrop>
  );
}
