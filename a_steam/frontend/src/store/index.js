import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice.js';
import authReducer  from './slices/authSlice.js';
import uiReducer    from './slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth:  authReducer,
    ui:    uiReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});
