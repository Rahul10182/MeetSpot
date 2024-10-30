import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { FirebaseProvider } from './context/Firebase';
import App from './App';
import store from './store/store'; // Import your Redux store

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* Provide the Redux store */}
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </Provider>
  </React.StrictMode>
);
