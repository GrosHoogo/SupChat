import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const primaryColor = '#35384A';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appel API - tu peux remplacer par mock ou simuler en attendant
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      alert('Compte créé avec succès ! Connectez-vous.');
      navigate('/login');
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: primaryColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#444964',
        padding: 30,
        borderRadius: 8,
        maxWidth: 400,
        width: '100%',
        boxShadow: '0 0 15px rgba(0,0,0,0.4)',
      }}>
        <h2 style={{ marginBottom: 20, textAlign: 'center' }}>Créer un compte</h2>

        <input
          type="text"
          placeholder="Nom d’utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>S’inscrire</button>

        <p style={{ marginTop: 15, textAlign: 'center', fontSize: 14 }}>
          Déjà un compte ? <a href="/login" style={{ color: '#80b3ff' }}>Connectez-vous</a>
        </p>
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: 10,
  marginBottom: 15,
  borderRadius: 4,
  border: 'none',
  fontSize: 16,
  outline: 'none',
};

const buttonStyle = {
  width: '100%',
  padding: 12,
  backgroundColor: '#80b3ff',
  border: 'none',
  borderRadius: 4,
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: 16,
  color: primaryColor,
  transition: 'background-color 0.3s ease',
};

export default RegisterPage;
