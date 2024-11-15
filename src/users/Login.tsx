import { useState } from "react";
import React from "react";
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import CryptoJS from "crypto-js";
import { useDispatch } from 'react-redux';
import { setUser } from '../features/user/userSlice';
import { loginUser } from "./loginApi";
import { useNavigate } from "react-router-dom";

interface LoginError {
  message: string;
}

export function Login() {
  const [error, setError] = useState<LoginError | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const username = data.get("login") as string;
    const password = data.get("password") as string;

    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      const result = await loginUser({ username, password: hashedPassword });
      const token = result.token;

      sessionStorage.setItem("sessionToken", token);
      dispatch(setUser({ token, username }));
      setError(null);
      form.reset();
      // useNavigate('/HomeSpace')
    } catch (loginError: any) {
      setError({ message: loginError.message });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Connexion
        </Typography>
        <form onSubmit={HandleSubmit}>
          <TextField name="login" label="Login" fullWidth margin="normal" />
          <TextField name="password" label="Password" type="password" fullWidth margin="normal" />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Connexion
          </Button>
        </form>
        {error && <Typography color="error">{error.message}</Typography>}
      </Box>
    </Container>
  );
}