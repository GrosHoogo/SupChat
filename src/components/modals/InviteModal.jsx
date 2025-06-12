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

export default function InviteModal({ onClose, onInvite }) {
  const [email, setEmail] = useState('');

  function handleInvite() {
    if (!email.trim()) return alert('Email requis');
    onInvite(email);
    setEmail('');
    onClose();
  }

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>Inviter un utilisateur</h2>
        <label>
          Email :
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <br /><br />
        <button onClick={handleInvite}>Envoyer invitation</button>{' '}
        <button onClick={onClose}>Annuler</button>
      </ModalContent>
    </ModalBackdrop>
  );
}
