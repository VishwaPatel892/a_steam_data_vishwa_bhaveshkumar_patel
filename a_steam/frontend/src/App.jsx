import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store';
import { createAppTheme } from './app/theme';
import AppRoutes from './routes';
import ToastContainer from './components/ToastContainer';

// Separate component to hook into Redux theme state
const ThemeWrapper = () => {
  const { mode } = useSelector((state) => state.theme);
  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  // Sync initial class manually in case it was missed (mostly handled by slice)
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
      <ToastContainer />
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeWrapper />
    </Provider>
  );
};

export default App;
