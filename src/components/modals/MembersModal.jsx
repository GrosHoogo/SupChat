import React from 'react';
import styled from 'styled-components';

export default function MembersModal({
  members,
  onChangeRole,
  onRemoveMember,
  onClose
}) {
  return (
    <Overlay>
      <Modal>
        <Header>
          <h3>Membres</h3>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <List>
          {members.map(member => (
            <ListItem key={member.id}>
              <Name>{member.email}</Name>
              <Role>{member.role}</Role>
              <Actions>
                <Button onClick={() => onChangeRole(member.id)}>Changer rôle</Button>
                <Button danger onClick={() => onRemoveMember(member.id)}>Retirer</Button>
              </Actions>
            </ListItem>
          ))}
        </List>
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
  z-index: 3000;
`;

const Modal = styled.div`
  background: white;
  padding: 1.5rem;
  width: 400px;
  border-radius: 8px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  font-size: 1.4rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-weight: bold;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid #ddd;
`;

const Name = styled.div`
  flex: 1 1 auto;
`;

const Role = styled.div`
  width: 80px;
  text-align: center;
  font-weight: bold;
  text-transform: capitalize;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const Button = styled.button`
  background-color: ${props => (props.danger ? '#dc3545' : '#007bff')};
  border: none;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover {
    background-color: ${props => (props.danger ? '#c82333' : '#0056b3')};
  }
`;
