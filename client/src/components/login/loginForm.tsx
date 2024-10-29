import React from 'react';
import useLogin from '../../hooks/useLogin';

/**
 * form component for the login screen for a user who already has an account
 * @returns LoginForm component that contains a form that requires the user to input their email and password, which is then submitted
 */
const LoginForm: React.FC = () => {
  const { handleSubmit } = useLogin();
  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <label> Email </label>
      <input type='email' placeholder='Enter your email' required />

      <label> Password </label>
      <input type='password' placeholder='Enter your password' required />

      <button type='submit' className='auth-btn'>
        {' '}
        Login{' '}
      </button>
    </form>
  );
};

export default LoginForm;
