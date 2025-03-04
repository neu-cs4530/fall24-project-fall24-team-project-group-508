/* eslint-disable no-console */
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useTextSize } from '../contexts/TextSizeContext';

/**
 * Interface for the useLogin hook.
 * @property username - The current value of the username input.
 * @property password - The current value of the password input.
 * @property handleInputChange - Function to handle changes in the input field.
 * @property handleSubmit - Function to handle login submission.
 * @property error - The current error message.
 */
interface UseLogin {
  username: string;
  email?: string;
  password: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  error: string | null;
}

/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useLogin = (isLogin: boolean): UseLogin => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { setUser, setAccount } = useLoginContext();
  const navigate = useNavigate();
  const { switchTheme } = useThemeContext();
  const { setTextSize } = useTextSize();

  /**
   * Function to handle the input change event.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const endpoint = isLogin
        ? `${process.env.REACT_APP_SERVER_URL}/login/login`
        : `${process.env.REACT_APP_SERVER_URL}/login/createAccount`;
      console.log('API URL:', endpoint);
      console.log('Request Body:', { username, hashedPassword: password, email });

      const reqBody = isLogin
        ? JSON.stringify({ username, hashedPassword: password })
        : JSON.stringify({
            username,
            hashedPassword: password,
            email,
            userType: 'user',
            settings: { theme: 'light', textSize: 'medium', screenReader: false },
          });
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: reqBody,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUser({
        username: data.username,
        hashedPassword: data.hashedPassword,
        email: data.email,
        userType: data.userType,
      });
      setAccount(data);

      // Set dark mode and text size according to user's settings on login
      switchTheme(data.settings.theme);
      setTextSize(data.settings.textSize);

      console.log('Account:', data);
      console.log('Account Settings:', data.settings);
      navigate('/home'); // redirect to home page after login/registration
    } catch (err) {
      console.log('Error:', err);
      const errorMessage = (err as Error).message;
      if (errorMessage.includes('Account does not exist')) {
        setError('Account does not exist. Please register.');
      } else if (errorMessage.includes('Incorrect password')) {
        setError('Incorrect password. Please try again.');
      } else if (errorMessage.includes('username')) {
        setError('An account with this username already exists.');
      } else if (errorMessage.includes('email')) {
        setError('An account with this email already exists.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return { username, password, handleInputChange, handleSubmit, error };
};

export default useLogin;
