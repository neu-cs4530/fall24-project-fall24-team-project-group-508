import React from 'react';
import useLogin from '../../hooks/useLogin';

/**
 * form component for the login screen for a user who already has an account
 * @returns LoginForm component that contains a form that requires the user to input their email and password, which is then submitted
 */
const LoginForm: React.FC = () => {
  const { username, password, handleInputChange, handleSubmit, error } = useLogin(true);
  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <label> Email </label>
      <input
        type='username'
        name='username'
        placeholder='Enter your username'
        value={username}
        onChange={handleInputChange}
        required
      />

      <label> Password </label>
      <input
        type='password'
        name='password'
        placeholder='Enter your password'
        value={password}
        onChange={handleInputChange}
        required
      />

      <button type='submit' className='auth-btn'>
        Login
      </button>
      {error && <p className='error-box'>{error}</p>}
    </form>
  );
};

export default LoginForm;
