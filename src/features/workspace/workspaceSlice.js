import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workspaces: [
    {
      id: '1',
      name: 'Projet Alpha',
      channels: [{ id: '1', name: 'Général' }, { id: '2', name: 'Tech' }],
    },
    {
      id: '2',
      name: 'Projet Beta',
      channels: [{ id: '1', name: 'Marketing' }],
    },
  ],
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    fetchWorkspaces(state) {
      // mock: pas besoin de changer quoi que ce soit ici pour le moment
    },
  },
});

export const { fetchWorkspaces } = workspaceSlice.actions;
export default workspaceSlice.reducer;