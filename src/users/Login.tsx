import React, { useState } from 'react';
import { loginUser } from './loginApi';
import { CustomError } from '../models/CustomError';
import { useNavigate } from 'react-router-dom';
import { Session } from '../models/Session';
import { Container, Box, Typography, TextField, Button, Link, Alert } from '@mui/material';

export function Login() {
  const [error, setError] = useState({} as CustomError);
  const [session, setSession] = useState({} as Session);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    loginUser(
      { user_id: -1, username: data.get('login') as string, password: data.get('password') as string },
      (result: Session) => {
        console.log(result);
        setSession(result);
        form.reset();
        setError(new CustomError(''));
        navigate('/messages/');
      },
      (loginError: CustomError) => {
        console.log(loginError);
        setError(loginError);
        setSession({} as Session);
      }
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          alt="UBO"
          src="https://beachild.fr/wp-content/uploads/2024/03/logo-UBO-1-removebg-preview.png"
          className="mx-auto h-10 w-auto"
        />
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          Linkchat
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="Nom d'Utilisateur"
            name="login"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de Passe"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Connexion
          </Button>
          {error.message && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.message}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Pas de compte?{' '}
            <Link href="register" variant="body2">
              Créer un Compte
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}