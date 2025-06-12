import React, { useState } from 'react';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  background: ${({ darkMode }) => (darkMode ? '#35384A' : '#35384A')};
  padding: 0.5rem 1rem;
  color: white;
`;

const LeftGroup = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  font-weight: 900;
  font-size: 1.8rem;
  color: #00ccff;
  text-shadow:
     1px 1px 0 #005577,
     2px 2px 0 #003344,
     3px 3px 5px rgba(0,0,0,0.6);
  user-select: none;
`;

const CenterGroup = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
`;

const SearchBar = styled.input`
  width: 250px;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: none;
  font-size: 0.95rem;
  outline: none;
  background-color: ${({ darkMode }) => (darkMode ? '#51546f' : '#ddd')};
  color: ${({ darkMode }) => (darkMode ? 'white' : '#222')};
`;

const RightGroup = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: ${({ darkMode }) => (darkMode ? '#575a7c' : '#5a5e80')};
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 1.1rem;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#6a6e94' : '#737aa7')};
  }
`;

export default function Navbar({ darkMode, onOpenSettings, onOpenProfile, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  }

  return (
    <NavbarContainer darkMode={darkMode}>
      <LeftGroup>
        <Logo>SUPCHAT</Logo>
      </LeftGroup>

      <CenterGroup>
        <SearchBar
          darkMode={darkMode}
          type="search"
          placeholder="Rechercher des messages..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </CenterGroup>

      <RightGroup>
        <NavButton darkMode={darkMode} onClick={onOpenSettings}>⚙️ Paramètres</NavButton>
        <NavButton darkMode={darkMode} onClick={onOpenProfile}>👤 Profil</NavButton>
      </RightGroup>
    </NavbarContainer>
  );
}
