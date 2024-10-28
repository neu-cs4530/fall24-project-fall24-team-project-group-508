import { useEffect, useState } from 'react';

/**
 * custom hook that allows the user to change the font size of all text
 * @returns textSize and setTextSize - the current text size and a function to set the text size
 */
const useFontSize = (): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [textSize, setTextSize] = useState(() => localStorage.getItem('textSize') || 'medium');

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

    localStorage.setItem('textSize', textSize);
  }, [textSize]);

  return [textSize, setTextSize];
};

export default useFontSize;
