import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirección
import HeaderUser from './HeaderUser';
import SideMenuB from './SideMenuB';
import './App.css';

const Home = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const navigate = useNavigate(); // Instanciar el hook para navegación

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const toggleChat = () => {
    setIsChatVisible((prev) => !prev);
  };

  const handleEventClick = (id) => {
    console.log('Clicked Event ID:', id); // Depuración para verificar que el ID es correcto
    navigate(`/event/${id}`);
  };
  

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { sender: 'user', text: inputMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');

    try {
      const response = await fetch('http://localhost:8085/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationId: 'unique_conversation_id',
          userId: 'unique_user_id',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al comunicarse con el backend');
      }

      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage = { sender: 'bot', text: 'Hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/events');
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % Math.max(events.length, 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [events]);

  const carouselEvents = events.slice(0, 3);

  return (
    <div className="home-container">
      <HeaderUser isLoggedIn={false} toggleSidebar={toggleSidebar} onLogout={() => console.log('Logout')} />
      <div className="sidebar-container">
        <SideMenuB isSidebarVisible={isSidebarVisible} showModal={() => {}} />
      </div>
      <div className={`content ${isSidebarVisible ? 'sidebar-open' : ''}`}>
        <div className="carousel">
          {carouselEvents.map((event, index) => (
            <div
              key={event._id}
              className={`carousel-slide ${currentSlide === index ? 'active' : ''}`}
              style={{ display: currentSlide === index ? 'block' : 'none' }}
            >
              <img src={`http://localhost:8080${event.head}`} alt={event.name} className="carousel-image" />
              <div className="carousel-text">
                <h3>{event.name}</h3>
              </div>
            </div>
          ))}
        </div>
        <h2 className="events-title">Eventos</h2>
        <div className="event-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <img
                src={`http://localhost:8080${event.image}`}
                alt={event.name}
                onClick={() => {
                  console.log('Clicked Event ID:', event._id); // Agregar depuración
                  handleEventClick(event._id);
                }}
              />
              <div className="event-details">
                <h3>{event.name}</h3>
                <p>{event.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="floating-buttons">
          <div className="chat-button">
            <a
              href="https://wa.me/+526182695522?text=Hola,%20tengo%20una%20duda%20sobre%20mi%20cuenta."
              target="_blank"
              rel="noopener noreferrer"
            >
              <button type="button">¿Tienes dudas?</button>
            </a>
          </div>
          <button className="floating-chat-button" onClick={toggleChat}>
            💬
          </button>
        </div>
        {isChatVisible && (
          <div className="floating-chat">
            <div className="chat-header">
              <h3>Asistente de IA</h3>
              <button className="close-chat" onClick={toggleChat}>
                X
              </button>
            </div>
            <div className="chat-body">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="chat-footer">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Enviar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
