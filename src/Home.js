import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          LinkChat 
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Text with anyone, anywhere!
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="contained" color="secondary" onClick={handleRegister}>
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;