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

export default function ProfileModal({ onClose, user }) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');

  function handleSave() {
    // Pour l'instant, juste fermer, car setUser n'est pas défini dans ce scope
    // Tu peux ajouter une logique pour sauvegarder via Redux ou API ici
    onClose();
  }

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>Profil</h2>
        <label>
          Nom :
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Email :
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <br /><br />
        <button onClick={handleSave}>Sauvegarder</button>{' '}
        <button onClick={onClose}>Annuler</button>
      </ModalContent>
    </ModalBackdrop>
  );
}
