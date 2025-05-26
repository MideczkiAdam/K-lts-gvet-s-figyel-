import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/protectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthPage />}/>
        <Route path='/Dashboard' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;

