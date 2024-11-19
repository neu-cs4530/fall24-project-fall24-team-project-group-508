import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import useLogin from '../../hooks/useLogin';

/**
 * form component for the login screen for a user who already has an account
 * @returns LoginForm component that contains a form that requires the user to input their email and password, which is then submitted
 */
const LoginForm: React.FC = () => {
  const { username, password, handleInputChange, handleSubmit, error } = useLogin(true);
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
        Login
      </Button>

      {error && (
        <Typography color='error' sx={{ mt: 2 }} variant='body2'>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default LoginForm;
