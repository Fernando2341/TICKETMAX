import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import React from 'react';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import CreateEvent from './CreateEvent';
import PromoterLogin from './LoginPromoters';
import AdminPanel from './AdminPanel';
import EventReport from './EventReport';
import VerEventos from './VerEventos';
import EventDetail from './EventDetail';


function App() {
  const [count, setCount] = useState(0)
  const [array, setArray] = useState([])

  const fetchAPI = async() => {
    const response = await axios.get("http://localhost:8080/api")
    setArray(response.data.fruits)
    console.log(response.data.fruits)
  }
  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-event" element={<CreateEvent />} /> {/* Nueva ruta */}
          <Route path="/promoters" element={<PromoterLogin />} /> {/* Nueva ruta */}
          <Route path='/admin' element={<AdminPanel />} /> 
          <Route path='/global-report' element={<EventReport />} />
          <Route path='/view-events' element={<VerEventos />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
        </Routes>
      </Router>
      {/*<div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + TailwindCSS</h1>
      <div className="card">
        {array.map((fruit, index) => (
          <div key={index}>
            <p>{fruit}</p>
            <br />
          </div>
        ))}
      </div>*/}
    </div>
  );
}

export default App
