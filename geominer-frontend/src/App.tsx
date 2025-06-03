import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';

function App() {
  return (
    <>
      <ToastProvider position={{ vertical: 'top', horizontal: 'center' }}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </>
  );
}

export default App;
