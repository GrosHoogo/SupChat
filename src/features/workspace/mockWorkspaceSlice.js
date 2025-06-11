import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workspaces: [
    { id: 1, name: 'Général', isPrivate: false },
    { id: 2, name: 'Développement', isPrivate: true },
  ],
};

let nextId = 3;

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    addMockWorkspace: (state, action) => {
      const newWorkspace = {
        id: nextId++,
        name: action.payload.name,
        isPrivate: action.payload.isPrivate,
      };
      state.workspaces.push(newWorkspace);
    },
  },
});

export const { addMockWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
