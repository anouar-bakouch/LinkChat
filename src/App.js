import './App.css';
import React from 'react'; // Import React
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './users/Login';
import Home from './Home';
import { Register } from './users/Register';
import { Chat } from './components/Chat';
import PrivateRoute from './PrivateRoute'; // Import PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<PrivateRoute element={<Chat />} />} /> 
        <Route path="/" element={<PrivateRoute element={<Home />} />} /> {/* Use PrivateRoute for Home */}
      </Routes>
    </Router>
  );
}

export default App;