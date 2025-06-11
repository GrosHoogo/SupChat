import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  channels: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setChannels(state, action) {
      state.channels = action.payload;
    },
  },
});

export const { addMessage, setChannels } = chatSlice.actions;
export default chatSlice.reducer;
