import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './VerEventos.module.css'; // Importar el módulo CSS
import SideMenuA from './SideMenuA';

const VerEventos = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null); // Guarda el evento seleccionado
  const [confirmInput, setConfirmInput] = useState('');

  // Obtener los eventos del servidor
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  // Muestra el modal de confirmación
  const handleShowConfirmModal = (event) => {
    setEventToDelete(event);
    setShowConfirmModal(true);
  };

  // Cierra el modal de confirmación
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setEventToDelete(null);
    setConfirmInput('');
  };

  // Confirma la eliminación si el título coincide
  const handleConfirmDelete = () => {
    if (confirmInput === eventToDelete?.name) {
      handleDelete(eventToDelete._id);
      handleCloseConfirmModal();
    } else {
      alert('El título ingresado no coincide. Intenta nuevamente.');
    }
  };

  // Elimina el evento
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/events/${id}`);
      setEvents(events.filter((event) => event._id !== id)); // Actualiza la lista
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };

  // Lógica de edición del evento (se puede implementar más adelante)
  const handleEdit = (id) => {
    console.log('Editar evento con ID:', id);
  };

  return (
    <div className= {styles.eventList}>
      
      <h1>Lista de Eventos</h1>
      <ul>
        {events.map((event) => (
          <li key={event._id} className={styles.eventItem}>
            <span className={styles.eventTitle} onClick={() => setSelectedEvent(event)}>
              {event.name}
            </span>
            <div className={styles.eventActions}>
              <button onClick={() => handleEdit(event._id)}>Editar</button>
              <button className={styles.deleteButton} onClick={() => handleShowConfirmModal(event)}>
                Eliminar
              </button>
              <img src={`http://localhost:8080${event.image}`} alt={event.name} className={styles.eventImage} />
            </div>
          </li>
        ))}
      </ul>

      {/* Modal para mostrar detalles del evento */}
      {selectedEvent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setSelectedEvent(null)}>X</button>
            <h2 className={styles.modalTitle}>{selectedEvent.name}</h2>
            <img
              src={`http://localhost:8080${selectedEvent.head}`}
              alt="Head"
              className={styles.modalHeadImage}
            />
            <div className={styles.modalInfo}>
              <img
                src={`http://localhost:8080${selectedEvent.image}`}
                alt="Principal"
                className={styles.modalMainImage}
              />
              <div className={styles.modalDetails}>
                <p><strong>Categoría:</strong> {selectedEvent.category}</p>
                <p><strong>Tipo de Evento:</strong> {selectedEvent.eventType}</p>
                <p><strong>Métodos de Pago:</strong> {selectedEvent.paymentMethods.join(', ')}</p>
                <p><strong>Subtítulo:</strong> {selectedEvent.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showConfirmModal && eventToDelete && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmModalContent}>
            <h3>¿Estás seguro de que deseas eliminar "{eventToDelete.name}"?</h3>
            <p>Escribe "{eventToDelete.name}" para confirmar:</p>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={`Escribe "${eventToDelete.name}"`}
              className={styles.confirmInput}
            />
            <div className={styles.modalButtons}>
              <button className={styles.deleteButton} onClick={handleConfirmDelete}>
                Eliminar
              </button>
              <button className={styles.cancelButton} onClick={handleCloseConfirmModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerEventos;
