import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthToken } from './features/auth/authSlice';
import PrivateRoute from './PrivateRoute';
import { Login } from './users/Login';
import { Chat } from './components/Chat';
import { Register } from './users/Register';
import { GroupChat } from './components/GroupChat';
import { RoomsList } from './components/RoomsList';
import { UserList } from './components/UserList';
import Home from './Home';
import Notifications from './Notifications.js';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    window.Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Unable to get permission to notify.');
      }
    });

    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(setAuthToken(token));
    }
  }, [dispatch]);

  return (
    <Notifications>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/rooms" element={<RoomsList />} />
        <Route path="/messages/user/:userId" element={<Chat />} />
        <Route path="/messages/room/:roomId" element={<GroupChat />} />
        <Route path="/messages/" element={<Chat />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
    </Notifications>
  );
}

export default App;