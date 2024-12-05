import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import googlelogo from './assets/googlelogo.svg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Datos recibidos en el frontend:', data);

      if (response.ok) {
        setMessage('Inicio de sesión exitoso');
        navigate('/');
      } else {
        setMessage(data.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setMessage('Error de conexión');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Link to="/" className={styles.homeButton}>
        TICKETMAX.MX
      </Link>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.header}>Bienvenido de Nuevo</h2>
        <div>
          <input
            type="text"
            id="username"
            placeholder="E-Mail"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.loginInput}
            required
          />
        </div>
        <div className="mt-4">
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.loginInput}
            required
          />
        </div>
        <Link to="/reset-password" className={styles.resetPassword}>
          Restablecer contraseña
        </Link>
        <button type="submit" className={styles.loginButton}>
          Iniciar Sesión
        </button>
        <a href="http://localhost:8080/auth/google" className={styles.googleButton}>
          <img src={googlelogo} alt="Google logo" className={styles.googleLogo} />
          Iniciar sesión con Google
        </a>
      </form>

      <p className={styles.signupLink}>
        ¿No tienes una cuenta?{' '}
        <Link to="/signup" className={styles.signupLinkText}>
          Registrarse
        </Link>
      </p>
      <p className={styles.loginMessage}>{message}</p>
    </div>
  );
};

export default Login;
