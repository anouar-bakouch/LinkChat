import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthToken } from './features/auth/authSlice';
import PrivateRoute from './PrivateRoute';
import { Login } from './users/Login';
import { Chat } from './components/Chat';
import Home from './Home';
import { Register } from './users/Register';

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(setAuthToken(token));
      // Optionally, you can also fetch the user data here
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Add Home route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Add Register route */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;