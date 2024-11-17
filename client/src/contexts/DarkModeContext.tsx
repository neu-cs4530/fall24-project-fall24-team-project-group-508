// DarkModeContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface DarkModeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(undefined);

export const DarkModeProvider: React.FC<{
  initialDarkMode: boolean;
  children: React.ReactNode;
}> = ({ initialDarkMode, children }) => {
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) throw new Error('useDarkMode must be used within a DarkModeProvider');
  return context;
};
