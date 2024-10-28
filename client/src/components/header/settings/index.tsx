// AccessibilityPopup.js
import React, { useState } from 'react';
import './index.css';
import { useDarkMode } from '../../../contexts/DarkModeContext';

interface AccessibilityPopupProps {
  onClose: () => void;
}

const AccessibilityPopup: React.FC<AccessibilityPopupProps> = ({ onClose }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [textSize, setTextSize] = useState('medium');

  const handleTextSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTextSize(e.target.value);
  };

  return (
    <div className={`popup ${darkMode ? 'dark' : ''}`}>
      <div className={`popup-content ${darkMode ? 'dark-content' : ''}`}>
        <h2 className='setting-option'>Accessibility Options</h2>

        {/* Accessibility options, each on its own line */}
        <div className='setting-option'>
          <label className='setting-option'>
            Text Size:
            <select>
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
