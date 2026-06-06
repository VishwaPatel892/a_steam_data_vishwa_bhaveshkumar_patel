import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#2563eb', // Matches Tailwind primary-600
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9333ea', // Purple
      light: '#c084fc',
      dark: '#7e22ce',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'light' ? '#f9fafb' : '#111827', // Gray 50 / Gray 900
      paper: mode === 'light' ? '#ffffff' : '#1f2937',   // White / Gray 800
    },
    text: {
      primary: mode === 'light' ? '#111827' : '#f9fafb',
      secondary: mode === 'light' ? '#4b5563' : '#9ca3af',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem', // Tailwind rounded-lg
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem', // Tailwind rounded-xl
          boxShadow: mode === 'light' 
            ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            : '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
        },
      },
    },
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
