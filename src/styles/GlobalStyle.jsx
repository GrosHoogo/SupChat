import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --main-color: #4A90E2;
    --border-color: #ddd;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    background: #f5f7fa;
    color: #333;
  }
  a {
    color: var(--main-color);
    text-decoration: none;
  }
`;

export default GlobalStyle;
