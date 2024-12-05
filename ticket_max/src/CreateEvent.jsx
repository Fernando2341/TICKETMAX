import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SideMenuA from './SideMenuA';
import styles from './CreateEvent.module.css';

const CreateEvent = () => {
  const [isReportSelected, setIsReportSelected] = useState(false);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    eventType: '',
    category: '',
    promoter: '',
    paymentMethods: [],
    image: null,
    head: null,
  });
  const [preview, setPreview] = useState('');
  const [headPreview, setHeadPreview] = useState(''); // Nueva vista previa para el header

  const handleReportSelection = () => {
    setIsReportSelected(!isReportSelected);
    if (!isReportSelected) setEmail('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview('');
    }
  };

  const handleHeadChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, head: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHeadPreview(reader.result); // Guardar la vista previa
      reader.readAsDataURL(file);
    } else {
      setHeadPreview('');
    }
  };

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => {
      const updatedMethods = prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method];
      return { ...prev, paymentMethods: updatedMethods };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, subtitle, eventType, category, promoter, paymentMethods, image, head } = formData;

    if (!name || !subtitle || !eventType || !category || !promoter || !paymentMethods.length || !image || !head) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('subtitle', subtitle);
    data.append('eventType', eventType);
    data.append('category', category);
    data.append('promoter', promoter);
    data.append('paymentMethods', JSON.stringify(paymentMethods));
    data.append('image', image);
    data.append('head', head);

    try {
      const response = await fetch('http://localhost:8080/api/events/create', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert('Evento creado exitosamente');
        setFormData({
          name: '',
          subtitle: '',
          eventType: '',
          category: '',
          promoter: '',
          paymentMethods: [],
          image: null,
          head: null,
        });
        setPreview('');
        setHeadPreview(''); // Resetear la vista previa del header
      } else {
        alert('Hubo un error al crear el evento.');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un problema al conectar con el servidor.');
    }
  };

  return (
    <div className={styles.createEventContainer}>

      <SideMenuA />

      <main className={styles.mainContent}>
        <h2>Crear Evento</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Nombre del Evento</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Subtítulo</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Imagen Principal</label>
            <input
              type="file"
              onChange={handleImageChange}
            />
            {preview && <img src={preview} alt="Vista previa" className={styles.previewImage} />}
          </div>
          <div className={styles.inputGroup}>
            <label>Imagen Cabezal</label>
            <input
              type="file"
              onChange={handleHeadChange}
            />
            {headPreview && <img src={headPreview} alt="Vista previa cabezal" className={styles.previewImage} />}
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo de Evento</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
            >
              <option value="">Selecciona un tipo</option>
              <option value="Standup">Standup</option>
              <option value="Música">Música</option>
              <option value="Teatro">Teatro</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Categoría</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Selecciona una categoría</option>
              <option value="Comedia">Comedia</option>
              <option value="Concierto">Concierto</option>
              <option value="Drama">Drama</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Promotor</label>
            <select
              name="promoter"
              value={formData.promoter}
              onChange={handleInputChange}
            >
              <option value="">Selecciona un promotor</option>
              <option value="Promotor A">Promotor A</option>
              <option value="Promotor B">Promotor B</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Métodos de Pago</label>
            <div>
              {['Sr Pago', 'Conekta', 'Mercado Pago', 'Banamex'].map((method) => (
                <label key={method}>
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods.includes(method)}
                    onChange={() => handlePaymentMethodChange(method)}
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>Crear Evento</button>
        </form>
      </main>
    </div>
  );
};

export default CreateEvent;
