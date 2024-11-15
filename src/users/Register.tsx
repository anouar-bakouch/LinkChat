import { useState } from "react";
import React from "react";
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import CryptoJS from "crypto-js";
import { registerUser } from "./RegisterApi";


interface RegisterError {
  message: string;
}

export function Register() {
  const [error, setError] = useState<RegisterError | null>(null);

  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const username = data.get("login") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      await registerUser({ username, email, password: hashedPassword });
      form.reset();
      setError(null);
    } catch (registerError: any) {
      setError({ message: registerError.message });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inscription
        </Typography>
        <form onSubmit={HandleSubmit}>
          <TextField name="login" label="Login" fullWidth margin="normal" />
          <TextField name="email" label="Email" fullWidth margin="normal" />
          <TextField name="password" label="Password" type="password" fullWidth margin="normal" />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Inscription
          </Button>
        </form>
        {error && <Typography color="error">{error.message}</Typography>}
      </Box>
    </Container>
  );
}