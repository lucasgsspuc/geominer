import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <>
      <ToastProvider position={{ vertical: 'top', horizontal: 'center' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </ToastProvider>
    </>
  );
}

export default App;
