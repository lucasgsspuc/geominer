import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { showToast } = useToast();
  const { login } = useAuth();

  const handleRegister = async () => {
    try {
      await AuthService.register({ name, email, password, username });
      await login(username, password);
      navigate('/');
    } catch (error) {
      showToast(
        'Não foi possível fazer o registro da conta. Por favor, tente novamente!',
        {
          severity: 'error',
          duration: 3000,
        }
      );
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Registrar</Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Nome"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Usuário"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
            >
              Registrar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid>
                <Link to="/login">Já possui uma conta? Entrar</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;
