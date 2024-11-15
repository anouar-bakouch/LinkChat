import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './users/Login';
import { Register } from './users/Register';
import { Chat } from './components/Chat';
import Home from './Home';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<PrivateRoute element={<Chat />} />} />
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
      </Routes>
    </Router>
  );
}

export default App;