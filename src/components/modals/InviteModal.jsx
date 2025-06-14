import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function InviteModal({ workspace, channel, onInvite, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleInvite = async () => {
    if (!email.trim()) {
      setError('Email requis');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const url = channel
        ? `${API_URL}/channels/${channel.id}/invite`
        : `${API_URL}/workspaces/${workspace.id}/invite`;

      await axios.post(
        url,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      alert(`Invitation envoyée à ${email}`);
      onInvite(email);
      onClose();
    } catch (err) {
      setLoading(false);
      setError('Erreur lors de l\'invitation');
      console.error(err);
    }
  };

  return (
    <Overlay>
      <Modal>
        <h3>Inviter un membre {channel ? `dans #${channel.name}` : `au workspace ${workspace.name}`}</h3>

        <input
          type="email"
          placeholder="Email de la personne"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <ButtonRow>
          <Button disabled={loading} onClick={handleInvite}>
            {loading ? 'Invitation...' : 'Inviter'}
          </Button>
          <Button secondary onClick={onClose} disabled={loading}>
            Annuler
          </Button>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Modal = styled.div`
  background: white;
  padding: 1.5rem;
  width: 320px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);

  h3 {
    margin-top: 0;
  }

  input {
    width: 100%;
    padding: 0.4rem;
    margin: 0.6rem 0 1rem 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  background-color: ${props => (props.secondary ? '#ccc' : '#007bff')};
  border: none;
  color: ${props => (props.secondary ? '#333' : 'white')};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${props => (props.secondary ? '#b3b3b3' : '#0056b3')};
  }
`;

const ErrorText = styled.div`
  color: #a33;
  margin-bottom: 0.8rem;
`;
