// DarkModeContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Apply 'dark' class to body based on darkMode state
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
