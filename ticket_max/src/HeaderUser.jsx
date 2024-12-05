import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeaderUser.module.css';
import profileIcon from './assets/profile-icon.svg'; // Ícono de perfil
import logoutIcon from './assets/logout-icon.svg'; // Ícono de logout
import logo from './assets/ticketmax-logo.svg';

const HeaderUser = ({ isLoggedIn, onLogout, toggleSidebar }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  // Función para alternar la visibilidad del menú lateral
  const handleToggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
    toggleSidebar(!isSidebarVisible); // Prop opcional para controlar el estado desde el padre
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.sidebarToggle} onClick={handleToggleSidebar}>
          ☰
        </button>
        <button className={styles.logoButton}>
          <img src={logo} alt="TicketMax Logo" className={styles.logo} />
        </button>
      </div>
      <nav className={styles.headerCenter}>
        <Link to="/promoters" className={styles.navLink}>Promotores</Link>
        <Link to="https://ticketmax.gestiondeaccesos.com/index.php?r=site/login&idseccionacces=fdg464g5d4g654df6g544g56d"
         className={styles.navLink}>Puntos de Venta</Link>
        <Link to="https://api.whatsapp.com/message/E5MRNNIDPMXCF1?autoload=1&app_absent=0" className={styles.navLink}>Contacto</Link>
      </nav>
      <div className={styles.headerRight}>
        {!isLoggedIn ? (
          <>
            <Link to="/signup" className={styles.headerLink}>Registrarse</Link>
            <Link to="/login" className={styles.headerLink}>Iniciar Sesión</Link>
          </>
        ) : (
          <>
            <button className={styles.iconButton}>
              <img src={profileIcon} alt="Perfil" className={styles.icon} />
            </button>
            <button className={styles.iconButton} onClick={onLogout}>
              <img src={logoutIcon} alt="Logout" className={styles.icon} />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default HeaderUser;
