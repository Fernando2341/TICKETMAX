import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css'; // Usa Login.module.css

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('promoter'); // Por defecto "promoter"

  const handleCreateUser = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/admin/create-user', {
        email,
        password,
        role,
      });
      alert(response.data.message);
    } catch (err) {
      console.error('Error al crear usuario:', err);
      alert('Error al crear usuario');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.header}>Panel de Administración</h2>
      <form className={styles.loginForm}>
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
            className={styles.loginInput} // Reutilizamos estilos
          >
            <option value="promoter">Promotor</option>
            <option value="admin">Administrador</option>
            <option value="sellpoint">Punto de Venta</option>
          </select>
        </div>
        <button
          type="button"
          className={styles.loginButton}
          onClick={handleCreateUser}
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
