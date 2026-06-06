import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: localStorage.getItem('themeMode') || 'light',
  sidebarOpen: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.mode);
      
      // Sync with Tailwind dark mode (class strategy)
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('themeMode', state.mode);
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarOpen } = themeSlice.actions;
export default themeSlice.reducer;
