import { createSlice } from '@reduxjs/toolkit';

export const TRANSIENT_MOODS = ['happy', 'cheer', 'concerned', 'focus'];

const initialState = {
  mood: 'idle',
  message: '',
  reaction: 0,
};

const mascotSlice = createSlice({
  name: 'mascot',
  initialState,
  reducers: {
    mascotReact: {
      reducer(state, action) {
        state.mood = action.payload.mood || 'happy';
        state.message = action.payload.message || '';
        state.reaction += 1;
      },
      prepare(payload = {}) {
        return { payload: { mood: payload.mood || 'happy', message: payload.message || '' } };
      },
    },
    mascotRest(state) {
      state.mood = 'idle';
      state.message = '';
      state.reaction += 1;
    },
  },
});

export const { mascotReact, mascotRest } = mascotSlice.actions;

export default mascotSlice.reducer;
