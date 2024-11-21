import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import CryptoJS from 'crypto-js';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { loginUser } from './loginApi';
import { setAuthToken } from '../features/auth/authSlice';

interface LoginError {
  message: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<LoginError | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const hashedPassword = CryptoJS.SHA256(password).toString();
    try {
      const result = await dispatch(loginUser({ username, password: hashedPassword }));
      const token = result.token;
      sessionStorage.setItem("sessionToken", token);
      dispatch(setAuthToken(token));
      setError(null);
      console.log('Login successful, navigating to /chat');
      navigate('/chat'); // Redirect to chat page after successful login
    } catch (loginError) {
      setError({ message: (loginError as Error).message });
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Connexion
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              name="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
          {error && <Typography color="error">{error.message}</Typography>}
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
          <Button variant="text" color="primary" onClick={handleRegister}>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;