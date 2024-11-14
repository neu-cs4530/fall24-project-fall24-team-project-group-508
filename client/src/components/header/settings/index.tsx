// /* eslint-disable no-console */
// import React, { useEffect, useState } from 'react';
// import './index.css';
// import { updateAccountSettings } from '../../../../../server/models/application';
// import { useDarkMode } from '../../../contexts/DarkModeContext';
// import useFontSize from '../../../hooks/useFontSizeEditor';
// import { Account } from '../../../types'; // Import the Account interface
// import useUserContext from '../../../hooks/useUserContext';

// interface AccessibilityPopupProps {
//   onClose: () => void;
// }

// const AccessibilityPopup: React.FC<AccessibilityPopupProps> = ({ onClose }) => {
//   const { darkMode, toggleDarkMode } = useDarkMode();
//   const [textSize, setTextSize] = useFontSize();
//   const { account } = useUserContext();
//   const [screenReader, setScreenReader] = useState(account.settings.screenReader);

//   useEffect(() => {
//     // Initialize the text size from localStorage or the account settings
//     const savedTextSize = localStorage.getItem('textSize') as 'small' | 'medium' | 'large' | null;
//     if (savedTextSize) {
//       setTextSize(savedTextSize);
//     } else {
//       setTextSize(account.settings.textSize); // Use account setting if no localStorage value
//     }
//   }, [account.settings.textSize, setTextSize]);

//   const handleTextSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newSize = e.target.value as 'small' | 'medium' | 'large';
//     setTextSize(newSize);
//     localStorage.setItem('textSize', newSize);

//     // Update account settings with the new text size
//     try {
//       // Update account settings with the new text size
//       if (account._id) {
//         updateAccountSettings(account._id, {
//           textSize: newSize,
//           darkMode: account.settings.darkMode,
//           screenReader: account.settings.screenReader,
//         });
//       } else {
//         console.error('Account ID is undefined');
//       }
//     } catch (error) {
//       console.error(error, 'Account ID is undefined');
//     }
//   };

//   const handleScreenReaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newScreenReaderState = e.target.checked;

//     try {
//       if (account._id) {
//         updateAccountSettings(account._id, {
//           screenReader: newScreenReaderState,
//           textSize: account.settings.textSize,
//           darkMode: account.settings.darkMode,
//         });
//       } else {
//         console.error('Account ID is undefined');
//       }
//     } catch (error) {
//       console.error(error, 'Account ID is undefined');
//     }
//   };

//   const handleDarkModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     toggleDarkMode();

//     // Update account settings with the new dark mode state
//     try {
//       if (account._id) {
//         updateAccountSettings(account._id, {
//           darkMode: e.target.checked,
//           textSize: account.settings.textSize,
//           screenReader: account.settings.screenReader,
//         });
//       } else {
//         console.error('Account ID is undefined');
//       }
//     } catch (error) {
//       console.error(error, 'Account ID is undefined');
//     }
//   };

//   return (
//     <div className={`popup ${darkMode ? 'dark' : ''}`}>
//       <div className={`popup-content ${darkMode ? 'dark-content' : ''}`}>
//         <h2 className='setting-option'>Accessibility Options</h2>

//         {/* Accessibility options, each on its own line */}
//         <div className='setting-option'>
//           <label className='setting-option'>
//             Text Size:
//             <select value={textSize} onChange={handleTextSizeChange}>
//               <option value='small'>Small</option>
//               <option value='medium'>Medium</option>
//               <option value='large'>Large</option>
//             </select>
//           </label>
//         </div>

//         <div className='setting-option'>
//           <label className='checkbox-label'>
//             <input
//               type='checkbox'
//               className='checkbox'
//               checked={screenReader}
//               onChange={handleScreenReaderChange}
//             />
//             Screen Reader Mode
//           </label>
//         </div>

//         <div className='setting-option'>
//           <label className='checkbox-label'>
//             <input
//               type='checkbox'
//               className='checkbox'
//               checked={darkMode}
//               onChange={handleDarkModeChange}
//             />
//             Dark Mode
//           </label>
//         </div>

//         <button onClick={onClose} className='close-btn'>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AccessibilityPopup;

import React from 'react';
import './index.css';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import useFontSize from '../../../hooks/useFontSizeEditor';
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

  // const handleDarkModeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   toggleDarkMode();
  //   setDarkMode(e.target.checked);
  // };

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
