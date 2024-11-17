import { useState } from 'react';
import './index.css';
import { Box, Button, Paper, Typography } from '@mui/material';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

/**
 * Login Component contains two forms: Login and Register. Logine requires the user to enter their email and password, where register requires the user to enter their name, email, and password.
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const root = document.documentElement;
  root.style.setProperty('--font-size', '16px');

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Typography variant='h5' component='h2' gutterBottom>
          {isLogin ? 'Login' : 'Create Account'}
        </Typography>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <Button variant='outlined' onClick={toggleForm} sx={{ mt: 2 }} aria-live='polite'>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
