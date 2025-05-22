// src/components/AuthPage.js
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './LoginForm.css'

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => setIsRegistering(!isRegistering);

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      {isRegistering ? <RegisterForm /> : <LoginForm />}
        <p style={{ textAlign: 'center', marginTop: 20 }}>
        {isRegistering ? (
            <div className='login-link'>
              <p>Már van fiókod? <a onClick={toggleForm}>Jelentkezz be</a></p>
            </div>
        ) : (
            <div className='register-link'>
              <p>Nincs még fiókod? <a onClick={toggleForm}>Regisztrálj</a></p>
            </div>
        )}
        </p>
    </div>
  );
};

export default AuthPage;
