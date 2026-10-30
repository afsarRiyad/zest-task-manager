import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '@/features/tasks/tasksSlice';
import categoriesReducer from '@/features/categories/categoriesSlice';
import mascotReducer from '@/features/mascot/mascotSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    categories: categoriesReducer,
    mascot: mascotReducer,
  },
});
