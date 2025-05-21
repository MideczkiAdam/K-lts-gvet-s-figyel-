// src/components/RegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css'

const RegisterForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});
    try {
      const response = await axios.post('http://localhost:8000/api/register/', formData);
      setMessage('Sikeres regisztráció!');
      setFormData({ username: '', password: '' });
    } catch (error) {
      setMessage('Hiba történt.');
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Regisztráció</h2>
      <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Felhasználónév" />
      {errors.username && <p>{errors.username}</p>}
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Jelszó" />
      {errors.password && <p>{errors.password}</p>}
      <button type="submit">Regisztrálok</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default RegisterForm;
