import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from '../src/app/store';

import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId="TON_CLIENT_ID_GOOGLE">
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);
