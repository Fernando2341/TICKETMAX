import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './EventDetail.module.css';
import HeaderUser from './HeaderUser';  // Importamos el header

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  // Función para obtener los datos del evento
  const fetchEvent = async () => {
    if (!eventId) {
      console.error('El eventId es inválido');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/events/${eventId}`);
      setEvent(response.data);
    } catch (err) {
      console.error('Error al obtener el evento:', err);
      setError('No se pudo cargar la información del evento.');
    }
  };

  // Efecto para llamar la API al cargar el componente
  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  // Mostrar error
  if (error) return <div className={styles.error}>{error}</div>;

  // Mostrar estado de carga
  if (!event) return <div className={styles.loading}>Cargando...</div>;

  // Mostrar el contenido del evento
  return (
    <div className={styles.pageContainer}>
      <HeaderUser isLoggedIn={true} onLogout={() => {}} toggleSidebar={() => {}} /> {/* Aquí insertamos el HeaderUser */}
      <div className={styles.container}>
        <div className={styles.header}>
          <img
            src={`http://localhost:8080${event.image}`}
            alt="Imagen del evento"
            className={styles.eventImage}
          />
          <div className={styles.eventInfo}>
            <h1 className={styles.title}>{event.name}</h1>
            <p className={styles.subtitle}>{event.subtitle}</p>
            <div className={styles.details}>
              <p>Tipo: {event.eventType}</p>
              <p>Categoría: {event.category}</p>
            </div>
            <p className={styles.promoter}>Promotor: {event.promoter}</p>
            <a
              href="https://ticketmaxmx.jimdosite.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.button}
            >
              Apartar boletos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
