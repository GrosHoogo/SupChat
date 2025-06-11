import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkspacePage from './pages/WorkspacePage';
import ChatPage from './pages/ChatPage';
import GlobalStyle from './styles/GlobalStyle';

function PrivateRoute({ children }) {
  const token = useSelector(state => state.auth.token);
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/workspace/:workspaceId" element={<PrivateRoute><WorkspacePage /></PrivateRoute>} />
          <Route path="/workspace/:workspaceId/channel/:channelId" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
