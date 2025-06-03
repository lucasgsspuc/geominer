import { LockOutlined } from '@mui/icons-material';
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      showToast('Não foi possível fazer o login. Por favor, tente novamente!', {
        severity: 'error',
        duration: 3000,
      });
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
          <Typography variant="h5">Entrar</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Entrar
            </Button>
            <Grid container justifyContent={'flex-end'}>
              <Grid>
                <Link to="/register">Não tem uma conta ainda? Registrar</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
