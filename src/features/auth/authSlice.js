import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      if (credentials.oauth === 'google') {
        // Auth via Google OAuth token
        const res = await axios.post(`${API_URL}/auth/google-login`, { token: credentials.token });
        const token = res.data.token || res.data.access_token;
        if (token) {
          localStorage.setItem('token', token);
        } else {
          return thunkAPI.rejectWithValue('Token manquant dans la réponse API');
        }
        return res.data;
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', credentials.email);
      params.append('password', credentials.password);
      // client_id et client_secret supprimés car inutilisés côté backend

      const res = await axios.post(`${API_URL}/auth/login`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const token = res.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        return thunkAPI.rejectWithValue('Token manquant dans la réponse API');
      }

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.detail || 'Nom d’utilisateur ou mot de passe incorrect.'
      );
    }
  }
);

// FETCH ME (user info)
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Session expirée ou invalide');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user || null;
        state.token = action.payload.access_token || localStorage.getItem('token');
        if (state.token) {
          localStorage.setItem('token', state.token);
        }
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
