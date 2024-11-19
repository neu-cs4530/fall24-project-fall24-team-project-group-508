import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import useLogin from '../../hooks/useLogin';

/**
 * form component for the login screen for a new user to register for an account
 * @returns RegisterForm component that contains a form that requires the user to input their name, email, and password, which is then submitted
 */
const RegisterForm: React.FC = () => {
  const root = document.documentElement;
  root.style.setProperty('--font-size', '16px');
  const { username, email, password, handleInputChange, handleSubmit, error } = useLogin(false);

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        p: 2,
      }}>
      <TextField
        label='Username'
        name='username'
        type='text'
        value={username}
        onChange={handleInputChange}
        placeholder='Enter your username'
        required
        fullWidth
        variant='outlined'
      />

      <TextField
        label='Email'
        name='email'
        type='email'
        value={email}
        onChange={handleInputChange}
        placeholder='Enter your email'
        required
        fullWidth
        variant='outlined'
      />

      <TextField
        label='Password'
        name='password'
        type='password'
        value={password}
        onChange={handleInputChange}
        placeholder='Enter your password'
        required
        fullWidth
        variant='outlined'
      />

      <Button type='submit' variant='contained' color='primary' sx={{ mt: 2 }}>
        Create Account
      </Button>

      {error && (
        <Typography color='error' sx={{ mt: 2 }} variant='body2'>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default RegisterForm;
