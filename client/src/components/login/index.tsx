import { useState } from 'react';
import './index.css';
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
    <div className='auth-container'>
      <div className='auth-card'>
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <button className='toggle-btn' onClick={toggleForm}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
