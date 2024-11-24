import React, { useState } from 'react';
import { loginUser } from './loginApi';
import { Session } from '../models/Session';
import { CustomError } from '../models/CustomError';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Link, Alert } from '@mui/material';

export function Login() {
  const [error, setError] = useState<CustomError | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const username = data.get('login') as string;
    const password = data.get('password') as string;

    try {
      await loginUser(
        { user_id: -1, username, password },
        (result: Session) => {
          console.log(result);
          setSession(result);
          form.reset();
          setError(null);
          navigate('/chat/');
        },
        (loginError: CustomError) => {
          console.log(loginError);
          setError(loginError);
          setSession(null);
        }
      );
    } catch (error) {
      console.error('Login error:', error);
      setError(new CustomError('An unexpected error occurred.'));
    }
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
          width={200}
          height={200}
          src="https://play-lh.googleusercontent.com/c5HiVEILwq4DqYILPwcDUhRCxId_R53HqV_6rwgJPC0j44IaVlvwASCi23vGQh5G3LIZ"
          className="mx-auto h-10 w-auto"
        />
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          linkchat
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
          {error && (
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