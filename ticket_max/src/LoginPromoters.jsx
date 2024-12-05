import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; // Usa Login.module.css

const LoginPromoters = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('promoter'); // Rol por defecto
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/promoters/login', {
        email,
        password,
        role,
      });

      if (response.data.redirectPath) {
        navigate(response.data.redirectPath);
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      alert('Inicio de sesión fallido');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.header}>Inicio de Sesión - Promotores</h2>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div>
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.loginInput}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.loginInput}
            required
          />
        </div>
        <div>
          <label htmlFor="role" className={styles.resetPassword}>
            Seleccionar Rol
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={styles.loginInput} // Reutilizamos estilos para el selector
          >
            <option value="promoter">Promotor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit" className={styles.loginButton}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginPromoters;
