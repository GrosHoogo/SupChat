import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (workspaceId, thunkAPI) => {
    try {
      const response = await api.get(`/workspaces/${workspaceId}/channels`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Erreur réseau');
    }
  }
);

const channelSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default channelSlice.reducer;
