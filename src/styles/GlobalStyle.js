import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ darkMode }) => (darkMode ? '#121212' : '#f5f6fa')};
    color: ${({ darkMode }) => (darkMode ? '#eee' : '#222')};
    margin: 0;
    font-family: Arial, sans-serif;
  }
`;

export default GlobalStyle;
