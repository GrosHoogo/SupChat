import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper pour ajouter le token aux headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

// Fetch accessible channels by workspace (GET /channels/accessible/{workspace_id})
export const fetchAccessibleChannelsByWorkspace = createAsyncThunk(
  'channels/fetchAccessibleByWorkspace',
  async (workspaceId, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/channels/accessible/${workspaceId}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur lors du chargement des canaux accessibles');
    }
  }
);

// Create channel (POST /channels/)
export const createChannel = createAsyncThunk(
  'channels/create',
  async ({ workspaceId, name, is_private }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/channels/`,
        { workspace_id: workspaceId, name, is_private },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur lors de la création du canal');
    }
  }
);

// Invite user to channel (POST /channels/{channel_id}/invite)
export const inviteUserToChannel = createAsyncThunk(
  'channels/inviteUser',
  async ({ channelId, email }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/channels/${channelId}/invite`,
        { email },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur lors de l\'invitation');
    }
  }
);

// Join private channel (POST /channels/{channel_id}/join)
export const joinPrivateChannel = createAsyncThunk(
  'channels/joinPrivate',
  async (channelId, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/channels/${channelId}/join`,
        {},
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur lors de la jointure du canal privé');
    }
  }
);

// Leave channel (DELETE /channels/{channel_id}/leave)
export const leaveChannel = createAsyncThunk(
  'channels/leave',
  async (channelId, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/channels/${channelId}/leave`, {
        headers: getAuthHeaders(),
      });
      return channelId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur lors de la sortie du canal');
    }
  }
);

// Update channel (PATCH /channels/{channel_id})
export const updateChannel = createAsyncThunk(
  'channels/update',
  async ({ channelId, name, is_private }, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${API_URL}/channels/${channelId}`,
        { name, is_private },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur lors de la mise à jour du canal');
    }
  }
);

// Delete channel (DELETE /channels/{channel_id})
export const deleteChannel = createAsyncThunk(
  'channels/delete',
  async (channelId, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/channels/${channelId}`, {
        headers: getAuthHeaders(),
      });
      return channelId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur lors de la suppression du canal');
    }
  }
);

// Pin channel (POST /channels/{channel_id}/pin)
export const pinChannel = createAsyncThunk(
  'channels/pin',
  async (channelId, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/channels/${channelId}/pin`,
        {},
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur lors de l\'épinglage du canal');
    }
  }
);

// Unpin channel (DELETE /channels/{channel_id}/unpin)
export const unpinChannel = createAsyncThunk(
  'channels/unpin',
  async (channelId, thunkAPI) => {
    try {
      const res = await axios.delete(
        `${API_URL}/channels/${channelId}/unpin`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Erreur lors du retrait de l\'épinglage du canal');
    }
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearChannelsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAccessibleChannelsByWorkspace
      .addCase(fetchAccessibleChannelsByWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccessibleChannelsByWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      .addCase(fetchAccessibleChannelsByWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createChannel
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channels.push(action.payload);
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // inviteUserToChannel
      .addCase(inviteUserToChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteUserToChannel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(inviteUserToChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // joinPrivateChannel
      .addCase(joinPrivateChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinPrivateChannel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(joinPrivateChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // leaveChannel
      .addCase(leaveChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = state.channels.filter(c => c.id !== action.payload);
      })
      .addCase(leaveChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateChannel
      .addCase(updateChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.channels.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteChannel
      .addCase(deleteChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = state.channels.filter(c => c.id !== action.payload);
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // pinChannel
      .addCase(pinChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
      })
      // unpinChannel
      .addCase(unpinChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
      });
  },
});

export const { clearChannelsError } = channelsSlice.actions;
export default channelsSlice.reducer;
