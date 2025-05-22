import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthPage />}/>
        <Route path='/Dashboard' element={<Dashboard />}/>
      </Routes>
    </Router>
  );
}

export default App;

