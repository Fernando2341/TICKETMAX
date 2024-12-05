import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SideMenuA.module.css'; // Puedes personalizar el estilo si es necesario

const SideMenuA = () => {
  const [eventMenuOpen, setEventMenuOpen] = useState(false);
  const [reportsMenuOpen, setReportsMenuOpen] = useState(false);

  const toggleEventMenu = () => setEventMenuOpen(!eventMenuOpen);
  const toggleReportsMenu = () => setReportsMenuOpen(!reportsMenuOpen);

  return (
    <aside className={styles.sidebar}>
      <h2>Menú</h2>
      <div>
        <button
          className={`${styles.menuButton} ${eventMenuOpen ? styles.active : ''}`}
          onClick={toggleEventMenu}
        >
          Eventos
        </button>
        {eventMenuOpen && (
          <ul className={styles.submenu}>
            <li><Link to="/view-events">Ver Eventos</Link></li>
            <li><Link to="/create-event">Crear Evento</Link></li>
          </ul>
        )}
        <button
          className={`${styles.menuButton} ${reportsMenuOpen ? styles.active : ''}`}
          onClick={toggleReportsMenu}
        >
          Reportes
        </button>
        {reportsMenuOpen && (
          <ul className={styles.submenu}>
            <li><Link to="/cas">CAS</Link></li>
            <li><Link to="/code-reader">CodeReader</Link></li>
            <li><Link to="/specific-reports">Específicos</Link></li>
            <li><Link to="/points-of-sale">Puntos de Ventas</Link></li>
            <li><Link to="/global-report">Reporte Global</Link></li>
            <li><Link to="/venue-report">Recinto</Link></li>
          </ul>
        )}
      </div>
      <div className={styles.sidebarDivider}></div>
    </aside>
  );
};

export default SideMenuA;
