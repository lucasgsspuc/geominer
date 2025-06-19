import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Faq from './pages/Faq';
import AppTheme from './theme/AppTheme';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <ToastProvider position={{ vertical: 'top', horizontal: 'center' }}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/faq" element={<Faq />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </AppTheme>
    </>
  );
}

export default App;
