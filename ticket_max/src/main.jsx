// src/index.js o src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Importa tu archivo CSS donde está configurado Tailwind

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
