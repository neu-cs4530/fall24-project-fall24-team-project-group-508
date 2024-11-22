/* eslint-disable no-console */
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';
import { useDarkMode } from '../contexts/DarkModeContext';
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
  const { setDarkMode } = useDarkMode();
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
            settings: { darkMode: false, textSize: 'medium', screenReader: false },
          });
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: reqBody,
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        const errorMessage = contentType?.includes('application/json')
          ? (await response.json()).message || 'An unknown error occurred.'
          : 'Something went wrong. Please try again later.';

        if (response.status === 401) {
          throw new Error(
            'Invalid username or password. Please check your credentials and try again.',
          );
        } else if (response.status === 404) {
          throw new Error('This username or email is already in use. Please try a different one.');
        } else {
          throw new Error(errorMessage);
        }
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
      setDarkMode(data.settings.darkMode);
      setTextSize(data.settings.textSize);

      console.log('Account:', data);
      console.log('Account Settings:', data.settings);
      navigate('/home'); // redirect to home page after login/registration
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };

  return { username, password, handleInputChange, handleSubmit, error };
};

export default useLogin;
