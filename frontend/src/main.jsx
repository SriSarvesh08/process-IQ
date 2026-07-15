import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-loading-skeleton/dist/skeleton.css';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
