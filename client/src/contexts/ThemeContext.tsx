// ThemeContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';

/**
 * Interface representing the context value for dark mode.
 * currentTheme - The current theme.
 * switchTheme - Function to switch the theme.
 * themes - The available themes.
 */
interface ThemeContextProps {
  currentTheme: keyof typeof themes;
  switchTheme: (themeName: keyof typeof themes) => void;
  themes: Record<keyof typeof themes, Theme>;
}

// const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#ffffff', paper: '#f5f5f5' },
    primary: { main: '#1976d2' },
    secondary: { main: '#ff4081' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#121212', paper: '#1e1e1e' },
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
  },
});

const northeasternTheme = createTheme({
  palette: {
    primary: { main: '#C8102E' },
    secondary: { main: '#000000' },
    background: { default: '#f5f5f5', paper: '#f5f5f5' },
    text: { primary: '#000000', secondary: '#666666' },
  },
});

const oceanicTheme = createTheme({
  palette: {
    primary: { main: '#0077b6' }, // Deep Blue
    secondary: { main: '#00b4d8' }, // Teal
    background: {
      default: '#caf0f8', // Light Aqua
      paper: '#caf0f8', // White
    },
    text: {
      primary: '#03045e', // Navy Blue
      secondary: '#023e8a', // Muted Blue
    },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 700,
      color: '#0077b6', // Deep Blue
    },
    body1: {
      fontSize: '1rem',
      color: '#03045e', // Navy Blue
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase text
          borderRadius: 8, // Rounded buttons
        },
      },
    },
  },
});

const highContrastTheme = createTheme({
  palette: {
    primary: { main: '#ffeb3b' }, // Bright Yellow for interactive elements
    secondary: { main: '#ff5722' }, // Bright Orange for highlights
    background: {
      default: '#000000', // Pure Black background
      paper: '#1a1a1a', // Slightly lighter black for contrast
    },
    text: {
      primary: '#ffffff', // Pure White for maximum readability
      secondary: '#ffeb3b', // Bright Yellow for secondary emphasis
    },
    error: { main: '#f44336' }, // Vivid Red for errors
    warning: { main: '#ff9800' }, // Bright Orange for warnings
    success: { main: '#4caf50' }, // Bright Green for success
    info: { main: '#03a9f4' }, // Vivid Blue for informational text
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      color: '#ffffff', // Pure White for headers
    },
    body1: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#ffffff', // Pure White for body text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          'textTransform': 'uppercase', // Ensure text is clear
          'backgroundColor': '#ffeb3b', // Bright Yellow
          'color': '#000000', // Black text for contrast
          '&:hover': {
            backgroundColor: '#fdd835', // Slightly darker Yellow
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a', // Contrast against pure black
          color: '#ffffff', // White text
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          'color': '#03a9f4', // Bright Blue links
          '&:hover': {
            color: '#0288d1', // Slightly darker Blue on hover
          },
        },
      },
    },
  },
});

const colorblindFriendlyTheme = createTheme({
  palette: {
    primary: { main: '#0072b2' }, // Blue
    secondary: { main: '#d55e00' }, // Orange
    background: {
      default: '#f0f0f0', // Light Grey
      paper: '#ffffff', // White
    },
    text: {
      primary: '#000000', // Black
      secondary: '#009e73', // Green
    },
    error: { main: '#cc79a7' }, // Pink
    warning: { main: '#e69f00' }, // Yellow-Orange
    success: { main: '#009e73' }, // Green
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 700,
      color: '#0072b2', // Blue
    },
    body1: {
      fontSize: '1rem',
      color: '#000000', // Black
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          'textTransform': 'none',
          'backgroundColor': '#0072b2', // Blue
          'color': '#ffffff', // White
          '&:hover': {
            backgroundColor: '#005d91', // Darker blue
          },
        },
      },
    },
  },
});

const greyscaleTheme = createTheme({
  palette: {
    primary: { main: '#6c757d' }, // Medium Grey for primary actions
    secondary: { main: '#adb5bd' }, // Light Grey for secondary actions
    background: {
      default: '#f8f9fa', // Light Grey for backgrounds
      paper: '#e9ecef', // Slightly darker grey for surfaces
    },
    text: {
      primary: '#212529', // Dark Grey for primary text
      secondary: '#495057', // Medium Grey for secondary text
    },
    error: { main: '#868e96' }, // Grey for errors (subtle feedback in this theme)
    warning: { main: '#adb5bd' }, // Light Grey for warnings
    success: { main: '#6c757d' }, // Medium Grey for success
    info: { main: '#ced4da' }, // Light Grey for informational elements
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.4rem',
      fontWeight: 700,
      color: '#212529', // Dark Grey for headers
    },
    body1: {
      fontSize: '1rem',
      color: '#495057', // Medium Grey for body text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          'textTransform': 'none',
          'backgroundColor': '#6c757d', // Medium Grey for buttons
          'color': '#f8f9fa', // Light Grey for text
          '&:hover': {
            backgroundColor: '#5a6268', // Slightly darker grey on hover
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#343a40', // Dark Grey for app bars
          color: '#f8f9fa', // Light Grey for text
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          'color': '#495057', // Medium Grey for links
          '&:hover': {
            color: '#212529', // Dark Grey on hover
          },
        },
      },
    },
  },
});

const themes = {
  light: lightTheme,
  dark: darkTheme,
  northeastern: northeasternTheme,
  oceanic: oceanicTheme,
  highContrast: highContrastTheme,
  colorblindFriendly: colorblindFriendlyTheme,
  greyscale: greyscaleTheme,
};

/**
 * CustomThemeProvider component to provide the theme context.
 * @param initialTheme - The initial theme to use.
 * @param children - The children to render.
 * @returns The custom theme provider.
 */
export const CustomThemeProvider: React.FC<{
  initialTheme: keyof typeof themes;
  children: React.ReactNode;
}> = ({ initialTheme, children }) => {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>(initialTheme);

  const switchTheme = (themeName: keyof typeof themes) => {
    if (themes[themeName as keyof typeof themes]) {
      setCurrentTheme(themeName);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Theme "${themeName}" does not exist`);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, switchTheme, themes }}>
      <ThemeProvider theme={themes[currentTheme]}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use the theme context.
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within a ThemeProviderWrapper');
  return context;
};
