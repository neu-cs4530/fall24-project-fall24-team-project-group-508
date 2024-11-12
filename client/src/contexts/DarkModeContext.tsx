// DarkModeContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the shape of our context data
interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context with a default value (it will be overridden by the provider)
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Custom hook to use the DarkModeContext
export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

// Provider component that supplies darkMode state to children
interface DarkModeProviderProps {
  children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to the socket server (adjust the URL as needed)
    const socketInstance = io('http://localhost:4000'); // Change this to your server URL
    setSocket(socketInstance);

    // Listen for darkMode change from other users
    socketInstance.on('darkModeChanged', (newMode: boolean) => {
      setDarkMode(newMode);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;

      // Emit the mode change through the socket to the server
      if (socket) {
        socket.emit('toggleDarkMode', newMode); // Emit the change to the server
      }

      return newMode;
    });
  };

  // Apply 'dark' class to body based on darkMode state
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);

    // Optionally save the darkMode setting to the server
    if (socket) {
      socket.emit('saveDarkMode', darkMode); // Save the user's dark mode preference on the server
    }
  }, [darkMode, socket]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
