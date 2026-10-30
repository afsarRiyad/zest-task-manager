import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    categoriesLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    categoriesLoaded(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.status = 'ready';
      state.error = null;
    },
    categoriesLoadFailed(state, action) {
      state.status = 'error';
      state.error = action.payload || 'Categories could not be loaded.';
    },
    categoryAdded(state, action) {
      state.items.push(action.payload);
    },
    categoryPatched(state, action) {
      const category = state.items.find((item) => item.id === action.payload.id);
      if (category) Object.assign(category, action.payload.changes);
    },
    categoryRemoved(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    categoriesCleared(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const {
  categoriesLoading,
  categoriesLoaded,
  categoriesLoadFailed,
  categoryAdded,
  categoryPatched,
  categoryRemoved,
  categoriesCleared,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
