import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import FakeStackOverflow from './components/fakestackoverflow';
import { FakeSOSocket } from './types';
import { DarkModeProvider } from './contexts/DarkModeContext';

const container = document.getElementById('root');

const App = () => {
  const [socket, setSocket] = useState<FakeSOSocket | null>(null);

  const serverURL = process.env.REACT_APP_SERVER_URL;

  if (serverURL === undefined) {
    throw new Error("Environment variable 'REACT_APP_SERVER_URL' must be defined");
  }

  useEffect(() => {
    if (!socket) {
      setSocket(io(serverURL));
    }

    return () => {
      if (socket !== null) {
        socket.disconnect();
      }
    };
  }, [socket, serverURL]);

  return (
    <Router>
      <DarkModeProvider initialDarkMode={false}>
        <FakeStackOverflow socket={socket} />
      </DarkModeProvider>
    </Router>
  );
};

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <DarkModeProvider initialDarkMode={false}>
      <App />
    </DarkModeProvider>,
  );
}
