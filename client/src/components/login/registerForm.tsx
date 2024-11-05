import React from 'react';
import useLogin from '../../hooks/useLogin';

/**
 * form component for the login screen for a new user to register for an account
 * @returns RegisterForm component that contains a form that requires the user to input their name, email, and password, which is then submitted
 */
const RegisterForm: React.FC = () => {
  const { handleSubmit } = useLogin();

  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <label>Name</label>
      <input type='text' placeholder='Enter your name' required />

      <label>Email</label>
      <input type='email' placeholder='Enter your email' required />

      <label>Password</label>
      <input type='password' placeholder='Enter your password' required />

      <button type='submit' className='auth-btn'>
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;
