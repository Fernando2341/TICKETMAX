import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './signup.module.css'; // Usamos el mismo archivo de estilos que el login

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registro exitoso');
        setTimeout(() => navigate('/'), 1000); // Redirige al Home 
      } else {
        setMessage(data.message || 'Error en el registro');
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
        <h2 className={styles.formTitle}>Registrarse</h2>
        <div>
          <input
            type="text"
            id="username"
            placeholder="Nombre de Usuario"
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
        <button type="submit" className={styles.loginButton}>
          Registrarse
        </button>
      </form>
      <p className={styles.loginMessage}>{message}</p>

      <p className={styles.signupLink}>
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className={styles.link}>
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
};

export default Signup;
