/* eslint-disable no-console */
import React from 'react';
import './index.css';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import { Account } from '../../../types';
import { updateAccountSettings } from '../../../services/accountService';
import { useTextSize } from '../../../contexts/TextSizeContext';

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
  const { textSize, setTextSize } = useTextSize();

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

  const handleTextChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value as 'small' | 'medium' | 'large';
    setTextSize(newSize);
    console.log('New size:', newSize);

    if (account && account._id && setAccount) {
      const updatedAccount = await updateAccountSettings(account._id, {
        ...account.settings,
        textSize: newSize,
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
            <select value={textSize} onChange={handleTextChange}>
              <option value='small'>Small</option>
              <option value='medium'>Medium</option>
              <option value='large'>Large</option>
            </select>
          </label>
        </div>

        <div className='setting-option'>
          {/* <label className='checkbox-label'>
            <input
              type='checkbox'
              className='checkbox'
              checked={screenReader}
              onChange={e => setScreenReader(e.target.checked)}
            />
            Screen Reader Mode
          </label> */}
          <label className='checkbox-label'>
            <input
              type='checkbox'
              className='checkbox'
              checked={false}
              onChange={() => console.log('Screen Reader Mode')}
            />
            Text to Speech Enabled
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
