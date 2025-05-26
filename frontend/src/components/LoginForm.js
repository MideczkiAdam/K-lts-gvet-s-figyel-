// src/components/LoginForm.js
import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import './LoginForm.css'
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';



const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  document.body.style.background = "url('/background.png')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

  return () => {
    document.body.style.background = "none";
  };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8000/api/token/', formData);
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      setMessage('Sikeres bejelentkezés!');
      navigate('/Dashboard');
    } catch (error) {
      setMessage('Hibás felhasználónév vagy jelszó.');
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Bejelentkezés</h1>
        <div className='input-box'>
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Felhasználónév" />
          <FaUser className='icon' />
        </div>
        <div className='input-box'>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Jelszó" />
          <FaLock className='icon'/>
        </div>

        <button type="submit">Belépés</button>

        
        {message && <p className='error'>{message}</p>}
      </form>
    </div>
    
  );
};

export default LoginForm;
