import React from 'react';
import useLogin from '../../hooks/useLogin';

/**
 * form component for the login screen for a new user to register for an account
 * @returns RegisterForm component that contains a form that requires the user to input their name, email, and password, which is then submitted
 */
const RegisterForm: React.FC = () => {
  const { username, email, password, handleInputChange, handleSubmit, error } = useLogin(false);

  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <label>Username</label>
      <input
        type='text'
        name='username'
        placeholder='Enter your username'
        value={username}
        onChange={handleInputChange}
        required
      />

      <label>Email</label>
      <input
        type='email'
        name='email'
        placeholder='Enter your email'
        value={email}
        onChange={handleInputChange}
        required
      />

      <label>Password</label>
      <input
        type='password'
        name='password'
        placeholder='Enter your password'
        value={password}
        onChange={handleInputChange}
        required
      />

      <button type='submit' className='auth-btn'>
        Create Account
      </button>
      {error && <p className='error-box'>{error}</p>}
    </form>
  );
};

export default RegisterForm;
