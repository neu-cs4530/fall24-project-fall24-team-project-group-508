/* eslint-disable no-console */
import React from 'react';
import './index.css';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import useAccountSettings from '../../../hooks/useAccountSettings';
import { Account } from '../../../types';
import { updateAccountSettings } from '../../../services/accountService';

interface AccessibilityPopupProps {
  account?: Account; // Account can be undefined
  setAccount?: (updatedAccount: Account | null) => void; // Can be undefined
  onClose: () => void;
}

const AccessibilityPopup: React.FC<AccessibilityPopupProps> = ({
  account,
  setAccount,
  onClose,
}) => {
  // const { darkMode, toggleDarkMode } = useDarkMode();
  const {
    textSize,
    setTextSize,
    screenReader,
    setScreenReader,
    darkMode: accountDarkMode,
    setDarkMode,
  } = useAccountSettings();

  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleDarkModeChange = async () => {
    toggleDarkMode();

    if (account && account._id && setAccount) {
      const updatedAccount = await updateAccountSettings(account._id, {
        ...account.settings,
        darkMode: !darkMode,
      });
      setAccount(updatedAccount);
    } else {
      console.error('Account ID is undefined');
    }
  };

  return (
    <div className={`popup ${darkMode ? 'dark' : ''}`}>
      <div className={`popup-content ${darkMode ? 'dark-content' : ''}`}>
        <h2 className='setting-option'>Accessibility Options</h2>

        <div className='setting-option'>
          <label className='setting-option'>
            Text Size:
            <select
              value={textSize}
              onChange={e => setTextSize(e.target.value as 'small' | 'medium' | 'large')}>
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
              checked={screenReader}
              onChange={e => setScreenReader(e.target.checked)}
            />
            Screen Reader Mode
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

        <button onClick={onClose} className='close-btn'>
          Close
        </button>
      </div>
    </div>
  );
};

export default AccessibilityPopup;
