import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './users/Login'; 
import Home from './Home';
import { Register } from './users/Register'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;