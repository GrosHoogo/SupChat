import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        form,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else if (err.request) {
        setError('Erreur réseau, pas de réponse du serveur.');
      } else {
        setError('Erreur: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#35384A',
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

        {error && <div style={{ marginBottom: 15, color: 'red' }}>{error}</div>}

        <input
          type="text"
          name="username"
          placeholder="Nom d’utilisateur"
          value={form.username}
          onChange={handleChange}
          required
          style={inputStyle}
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
          disabled={loading}
        />

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Inscription en cours...' : 'S’inscrire'}
        </button>

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
  color: '#35384A',
  transition: 'background-color 0.3s ease',
};

export default RegisterPage;
