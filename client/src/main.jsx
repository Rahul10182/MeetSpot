import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css';
import { FirebaseProvider } from './context/Firebase';
import App from './App';
import store from './store/store'; // Import your Redux store
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#ff4081', // Pink
    },
  },
});




createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* Provide the Redux store */}
    <ThemeProvider theme={theme}>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
