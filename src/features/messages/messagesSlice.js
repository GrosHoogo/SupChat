import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: token ? `Bearer ${token}` : '' };
};

// Charger messages d’un channel
export const fetchMessagesByChannel = createAsyncThunk(
  'messages/fetchByChannel',
  async (channelId, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/messages/channel/${channelId}`, {
        headers: getAuthHeaders(),
      });
      return { channelId, messages: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur chargement messages');
    }
  }
);

// Envoyer un message
export const sendMessage = createAsyncThunk(
  'messages/send',
  async ({ channelId, text }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/messages/`, { channel_id: channelId, text }, {
        headers: getAuthHeaders(),
      });
      return res.data; // message créé avec id
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur envoi message');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    byChannel: {}, // { channelId: [messages] }
    loading: false,
    error: null,
  },
  reducers: {
    addReaction(state, action) {
      const { channelId, messageId, reaction } = action.payload;
      const channelMessages = state.byChannel[channelId];
      if (channelMessages) {
        const msg = channelMessages.find(m => m.id === messageId);
        if (msg) {
          msg.reactions = msg.reactions || {};
          msg.reactions[reaction] = (msg.reactions[reaction] || 0) + 1;
        }
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMessagesByChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesByChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.byChannel[action.payload.channelId] = action.payload.messages;
      })
      .addCase(fetchMessagesByChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Ajout message envoyé dans le bon channel
        const channelId = action.payload.channel_id;
        if (!state.byChannel[channelId]) state.byChannel[channelId] = [];
        state.byChannel[channelId].push(action.payload);
      });
  }
});

export const { addReaction, clearError } = messagesSlice.actions;
export default messagesSlice.reducer;
