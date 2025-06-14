import React, { useState } from 'react';
import styled from 'styled-components';

export default function CreateChannelModal({ onCreateChannel, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Nom requis');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onCreateChannel({ name, description, is_private: isPrivate });
    } catch (err) {
      setError(err.message || 'Erreur création canal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <h3>Créer un nouveau canal</h3>

        <label>Nom</label>
        <input
          type="text"
          placeholder="Nom du canal"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
        />

        <label>Description (optionnelle)</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
          rows={3}
        />

        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={e => setIsPrivate(e.target.checked)}
            disabled={loading}
          />{' '}
          Canal privé
        </label>

        {error && <ErrorText>{error}</ErrorText>}

        <ButtonRow>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? 'Création...' : 'Créer'}
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
  width: 360px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);

  h3 {
    margin-top: 0;
  }

  label {
    display: block;
    margin-top: 1rem;
    font-weight: bold;
  }

  input[type='text'],
  textarea {
    width: 100%;
    padding: 0.4rem;
    margin-top: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    resize: vertical;
  }

  input[type='checkbox'] {
    margin-right: 0.4rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  background-color: ${props => (props.secondary ? '#ccc' : '#28a745')};
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
    background-color: ${props => (props.secondary ? '#b3b3b3' : '#218838')};
  }
`;

const ErrorText = styled.div`
  color: #a33;
  margin-top: 0.8rem;
`;
