// AccessibilityPopup.js
import React, { useEffect, useState } from 'react';
import './index.css';
import { useDarkMode } from '../../../contexts/DarkModeContext';

interface AccessibilityPopupProps {
  onClose: () => void;
}

const AccessibilityPopup: React.FC<AccessibilityPopupProps> = ({ onClose }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>(
    () => (localStorage.getItem('textSize') as 'small' | 'medium' | 'large') || 'medium',
  );

  const handleTextSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value as 'small' | 'medium' | 'large';
    setTextSize(newSize);
    localStorage.setItem('textSize', newSize);
  };

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
    <div className={`popup ${darkMode ? 'dark' : ''}`}>
      <div className={`popup-content ${darkMode ? 'dark-content' : ''}`}>
        <h2 className='setting-option'>Accessibility Options</h2>

        {/* Accessibility options, each on its own line */}
        <div className='setting-option'>
          <label className='setting-option'>
            Text Size:
            <select value={textSize} onChange={handleTextSizeChange}>
              <option value='small'>Small</option>
              <option value='medium'>Medium</option>
              <option value='large'>Large</option>
            </select>
          </label>
        </div>

        <div className='setting-option'>
          <label className='checkbox-label'>
            <input type='checkbox' className='checkbox' />
            High Contrast Mode
          </label>
        </div>

        <div className='setting-option'>
          <label className='checkbox-label'>
            <input
              type='checkbox'
              className='checkbox'
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            Dark Mode
          </label>
        </div>

        <div className='setting-option'>
          <label className='checkbox-label'>
            <input type='checkbox' className='checkbox' />
            Screen Reader Mode
          </label>
        </div>

        <button onClick={onClose} className='close-btn'>
          Close
        </button>
      </div>
    </div>
  );
};

export default AccessibilityPopup;
