import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice.js';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    // Add other feature slices here (e.g., auth, games)
  },
  devTools: import.meta.env.MODE !== 'production',
});
