import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './RegisterApi';
import { User } from '../models/User';
import { CustomError } from '../models/CustomError';
import { Container, Box, Typography, TextField, Button, Link, Alert } from '@mui/material';

export function Register() {
  const [error, setError] = useState<CustomError | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const username = data.get('username') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    try {
      const newUser: User = {
        user_id: -1, // This will be set by the backend
        username,
        email,
        password,
        created_at: new Date().toISOString(), // Set the created_at field
        avatar_url: undefined, // Set the avatar_url field
      };

      await registerUser(newUser);
      form.reset();
      setError(null);
      navigate('/login');
    } catch (registerError: any) {
      setError({ name: 'RegisterError', message: registerError.message });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inscription
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nom d'Utilisateur"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
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
            Inscription
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.message}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Déjà un compte?{' '}
            <Link href="login" variant="body2">
              Connexion
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}