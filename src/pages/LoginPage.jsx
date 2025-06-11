import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 8px rgb(53 56 74 / 0.3);
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: var(--main-color, #35384A);
  color: white;
  border: none;
  width: 100%;
  padding: 0.7rem;
  font-size: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #2c2f42;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  const [form, setForm] = useState({ username: '', password: '' });

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(loginUser({ oauth: 'google', token: credentialResponse.credential }));
  };

  useEffect(() => {
    if (auth.user) {
      navigate('/dashboard');
    }
  }, [auth.user, navigate]);

  return (
    <Container>
      <h2>Connexion</h2>
      {auth.error && <ErrorMessage>{auth.error}</ErrorMessage>}
      <form onSubmit={onSubmit}>
        <Input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={form.username}
          onChange={onChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={onChange}
        />
        <Button type="submit" disabled={auth.loading}>Se connecter</Button>
      </form>
      <p>
        Pas encore de compte ? <a href="/register">Inscrivez-vous ici</a>
      </p>
      <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert('Erreur Google Login')} />
    </Container>
  );
}
