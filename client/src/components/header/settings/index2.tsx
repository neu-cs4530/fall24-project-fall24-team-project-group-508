import React, { useEffect } from 'react';
import './index.css';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import useFontSize from '../../../hooks/useFontSizeEditor';
import socket from '../../../socket'; // Import the socket connection

interface AccessibilityPopupProps {
  onClose: () => void;
}

const AccessibilityPopup: React.FC<AccessibilityPopupProps> = ({ onClose }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [textSize, setTextSize] = useFontSize();

  // Update text size and emit change to the server
  const handleTextSizeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value as 'small' | 'medium' | 'large';
    setTextSize(newSize);

    // Save the new size to the user account
    await fetch('/api/user/accessibility-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textSize: newSize }),
    });

    // Emit the new setting to the server
    socket.emit('updateAccessibility', { textSize: newSize });
  };

  // Update dark mode and emit change to the server
  const handleDarkModeChange = async () => {
    toggleDarkMode();

    // Save the new setting to the user account
    await fetch('/api/user/accessibility-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ darkMode: !darkMode }),
    });

    // Emit the new setting to the server
    socket.emit('updateAccessibility', { darkMode: !darkMode });
  };

  useEffect(() => {
    // Listen for updates from the server
    socket.on('accessibilityUpdate', newSettings => {
      // Update the settings locally based on the received data
      if (newSettings.textSize) setTextSize(newSettings.textSize);
      if (newSettings.darkMode !== undefined) toggleDarkMode(newSettings.darkMode);
    });

    return () => {
      socket.off('accessibilityUpdate'); // Clean up the listener
    };
  }, [setTextSize, toggleDarkMode]);

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
            <input
              type='checkbox'
              className='checkbox'
              checked={darkMode}
              onChange={handleDarkModeChange}
            />
            Dark Mode
          </label>
        </div>

        {/* Add more settings as needed, with similar structure */}
        <button onClick={onClose} className='close-btn'>
          Close
        </button>
      </div>
    </div>
  );
};

export default AccessibilityPopup;
