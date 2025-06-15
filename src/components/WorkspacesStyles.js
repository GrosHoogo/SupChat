import styled from 'styled-components';
import { FaLock } from 'react-icons/fa';

export const Container = styled.div`
  width: 280px;
  background-color: ${props => (props.darkMode ? '#42465d' : '#f4f4f4')};
  color: ${props => (props.darkMode ? '#eee' : '#333')};
  border-right: 1px solid #ccc;
  padding: 1rem;
  overflow-y: auto;
`;

export const Header = styled.h2`
  margin-top: 0;
`;

export const WorkspaceTitle = styled.div`
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  margin: 0.3rem 0;
  display: flex;
  justify-content: space-between;
  background-color: ${props => (props.selected ? '#ddd' : 'transparent')};
  border-radius: 4px;
  align-items: center;

  &:hover {
    background-color: #ccc;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.4rem;
`;

export const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  padding: 2px;

  &:hover {
    color: #007bff;
  }
`;

export const ChannelList = styled.ul`
  list-style: none;
  margin: 0.3rem 0 0.3rem 1rem;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
`;

export const ChannelItem = styled.li`
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  border-radius: 3px;
  background-color: ${props => (props.selected ? '#ccc' : 'transparent')};

  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background-color: #bbb;
  }
`;

export const LockIcon = styled(FaLock)`
  font-size: 0.8rem;
  color: #888;
`;

export const AddChannelButton = styled.button`
  margin: 0.3rem 0 0.5rem 1rem;
  padding: 0.4rem 0.8rem;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;

  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background-color: #218838;
  }
`;

export const AddWorkspaceButton = styled(AddChannelButton)`
  width: 90%;
  margin-top: 1rem;
  background-color: #007bff;

  &:hover {
    background-color: #0069d9;
  }
`;

export const SectionTitle = styled.h3`
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`;

export const PublicWorkspaceItem = styled.div`
  padding: 0.4rem 0.8rem;
  margin: 0.2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => (props.darkMode ? '#333' : '#eee')};
  border-radius: 4px;
`;

export const JoinButton = styled.button`
  background-color: ${props => (props.joined ? '#6c757d' : '#007bff')};
  border: none;
  padding: 0.3rem 0.8rem;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.joined ? '#5a6268' : '#0056b3')};
  }
`;

export const PinnedHeader = styled.div`
  font-weight: bold;
  margin: 0.5rem 0 0.3rem 1rem;
  color: ${props => (props.darkMode ? '#ddd' : '#444')};
`;

export const PinnedList = styled.ul`
  list-style: none;
  padding-left: 1rem;
  margin: 0;
`;

export const PinnedItem = styled.li`
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  background-color: ${props => (props.selected ? '#bbb' : 'transparent')};
  &:hover {
    background-color: #aaa;
  }
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;