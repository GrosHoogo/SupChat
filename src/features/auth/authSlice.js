import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { users } from '../../mocks/mockData';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    const { username, password } = credentials;

    // Simulation côté frontend (mot de passe fictif = "password")
    const user = users.find(u => u.username === username);

    if (user && password === 'password') {
      return user;
    } else {
      return thunkAPI.rejectWithValue('Nom d’utilisateur ou mot de passe incorrect.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
