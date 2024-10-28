import { useState } from 'react';
import './index.css';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <button className='toggle-btn' onClick={toggleForm}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
    // <div className='container'>
    //   <h2>Welcome to FakeStackOverflow!</h2>
    //   <h4>Please enter your username.</h4>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type='text'
    //       value={username}
    //       onChange={handleInputChange}
    //       placeholder='Enter your username'
    //       required
    //       className='input-text'
    //       id={'usernameInput'}
    //     />
    //     <button type='submit' className='login-button'>
    //       Submit
    //     </button>
    //   </form>
    // </div>
  );
};

export default Login;
