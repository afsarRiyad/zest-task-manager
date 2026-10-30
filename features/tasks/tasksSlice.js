import { createSlice } from '@reduxjs/toolkit';
import { categoryRemoved } from '@/features/categories/categoriesSlice';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    tasksLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    tasksLoaded(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.status = 'ready';
      state.error = null;
    },
    tasksLoadFailed(state, action) {
      state.status = 'error';
      state.error = action.payload || 'Tasks could not be loaded.';
    },
    taskAdded(state, action) {
      state.items.unshift(action.payload);
    },
    taskPatched(state, action) {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (task) Object.assign(task, action.payload.changes);
    },
    taskRemoved(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    taskRestored(state, action) {
      const task = action.payload;
      if (!task || state.items.some((item) => item.id === task.id)) return;
      state.items.unshift(task);
    },
    tasksCleared(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(categoryRemoved, (state, action) => {
      for (const task of state.items) {
        if (task.categoryId === action.payload) task.categoryId = null;
      }
    });
  },
});

export const {
  tasksLoading,
  tasksLoaded,
  tasksLoadFailed,
  taskAdded,
  taskPatched,
  taskRemoved,
  taskRestored,
  tasksCleared,
} = tasksSlice.actions;

export default tasksSlice.reducer;
