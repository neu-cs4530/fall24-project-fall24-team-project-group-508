// TextSizeContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Interface representing the context value for dark mode.
 * textSize - The current text size setting.
 * setTextSize - Function to set the text size setting.
 */
interface TextSizeContextProps {
  textSize: 'small' | 'medium' | 'large';
  setTextSize: (value: 'small' | 'medium' | 'large') => void;
}

const TextSizeContext = createContext<TextSizeContextProps | undefined>(undefined);

/**
 * Provider component that wraps the app and provides the text size context.
 */
export const TextSizeProvider: React.FC<{
  initialTextSize: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}> = ({ initialTextSize, children }) => {
  const [textSize, setTextSize] = useState(initialTextSize);

  useEffect(() => {
    const root = document.documentElement;
    switch (textSize) {
      case 'small':
        root.style.setProperty('--font-size', '12px');
        break;
      case 'medium':
        root.style.setProperty('--font-size', '16px');
        break;
      case 'large':
        root.style.setProperty('--font-size', '20px');
        break;
      default:
        root.style.setProperty('--font-size', '16px');
    }
  }, [textSize]);

  return (
    <TextSizeContext.Provider value={{ textSize, setTextSize }}>
      {children}
    </TextSizeContext.Provider>
  );
};

/**
 * Hook to use the text size context.
 */
export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (!context) throw new Error('useTextSize must be used within a TextSizeProvider');
  return context;
};
