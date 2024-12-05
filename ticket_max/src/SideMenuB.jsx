import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import styles from './SideMenuB.module.css';

const SideMenuB = ({ isSidebarVisible, showModal }) => {
  return (
    <div className={`${styles.sidebar} ${isSidebarVisible ? '' : styles.hidden}`}>
      <div className={styles.menuContent}>
        <ul className={styles.menuList}>
          <li>
            <span onClick={() => showModal('Privacidad')} className={styles.link}>
              Aviso de Privacidad
            </span>
          </li>
          <li>
            <span onClick={() => showModal('Cookies')} className={styles.link}>
              Uso de Cookies
            </span>
          </li>
          <li>
            <span onClick={() => showModal('Términos')} className={styles.link}>
              Términos y Condiciones
            </span>
          </li>
        </ul>
        <div className={styles.socialLinks}>
          <a
            href="https://www.facebook.com/ticketmaxmx"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <FontAwesomeIcon icon={faFacebook} />
            <span>Facebook</span>
          </a>
          <a
            href="https://www.instagram.com/ticketmax.mx.of"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <FontAwesomeIcon icon={faInstagram} />
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideMenuB;
