// import { useState, useEffect } from 'react';
// import useUserContext from './useUserContext';
// import updateSettings from '../services/accountService';
// import useLoginContext from './useLoginContext';

// type TextSize = 'small' | 'medium' | 'large';

// interface AccountSettings {
//   textSize: TextSize;
//   darkMode: boolean;
//   screenReader: boolean;
// }

// const useAccountSettings = () => {
//   const { account } = useUserContext();
//   const { setAccount } = useLoginContext();
//   const [textSize, setTextSize] = useState<TextSize>(account.settings.textSize);
//   const [screenReader, setScreenReader] = useState<boolean>(account.settings.screenReader);
//   const [darkMode, setDarkMode] = useState<boolean>(account.settings.darkMode);

//   useEffect(() => {
//     const savedTextSize = localStorage.getItem('textSize') as TextSize | null;
//     setTextSize(savedTextSize ?? account.settings.textSize);
//   }, [account.settings.textSize]);

//   const updateAccountSettings = async (newSettings: Partial<AccountSettings>) => {
//     if (!account._id) {
//       console.error('Account ID is undefined');
//       return;
//     }

//     try {
//       const updatedAccount = await updateSettings(account._id, {
//         ...account.settings,
//         ...newSettings,
//       });
//       console.log(updatedAccount);
//       setAccount(updatedAccount); // Update account in context to keep data in sync
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleTextSizeChange = (newSize: TextSize) => {
//     setTextSize(newSize);
//     localStorage.setItem('textSize', newSize);
//     updateAccountSettings({ textSize: newSize });
//   };

//   const handleScreenReaderChange = (newScreenReader: boolean) => {
//     setScreenReader(newScreenReader);
//     updateAccountSettings({ screenReader: newScreenReader });
//   };

//   const handleDarkModeChange = (newDarkMode: boolean) => {
//     setDarkMode(newDarkMode);
//     updateAccountSettings({ darkMode: newDarkMode });
//   };

//   return {
//     textSize,
//     setTextSize: handleTextSizeChange,
//     screenReader,
//     setScreenReader: handleScreenReaderChange,
//     darkMode,
//     setDarkMode: handleDarkModeChange,
//   };
// };

// export default useAccountSettings;

import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import useLoginContext from './useLoginContext';
import updateSettings from '../services/accountService';
import { useDarkMode } from '../contexts/DarkModeContext';
import useFontSize from './useFontSizeEditor';

type TextSize = 'small' | 'medium' | 'large';

interface AccountSettings {
  textSize: TextSize;
  darkMode: boolean;
  screenReader: boolean;
}

const useAccountSettings = () => {
  const { account } = useUserContext();
  const { setAccount } = useLoginContext();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [textSize, setTextSize] = useFontSize();
  const [screenReader, setScreenReader] = useState<boolean>(account.settings.screenReader);

  useEffect(() => {
    // Initialize font size from account settings if present
    if (account.settings.textSize) {
      setTextSize(account.settings.textSize);
    }
    if (account.settings.darkMode) {
      if (account.settings.darkMode !== darkMode) {
        toggleDarkMode();
      }
    }
    if (account.settings.screenReader) {
      setScreenReader(account.settings.screenReader);
    }
  }, [
    account.settings.darkMode,
    account.settings.screenReader,
    account.settings.textSize,
    darkMode,
    setTextSize,
    toggleDarkMode,
  ]);

  const updateAccountSettings = async (newSettings: Partial<AccountSettings>) => {
    if (!account._id) {
      console.error('Account ID is undefined');
      return;
    }

    try {
      const updatedAccount = await updateSettings(account._id, {
        ...account.settings,
        ...newSettings,
      });
      setAccount(updatedAccount); // Update account in context to keep data in sync
    } catch (error) {
      console.error(error);
    }
  };

  const handleTextSizeChange = (newSize: TextSize) => {
    setTextSize(newSize);
    updateAccountSettings({ textSize: newSize });
  };

  const handleScreenReaderChange = (newScreenReader: boolean) => {
    setScreenReader(newScreenReader);
    updateAccountSettings({ screenReader: newScreenReader });
  };

  const handleDarkModeChange = () => {
    toggleDarkMode(); // Toggle dark mode using the context
    updateAccountSettings({ darkMode: !darkMode });
  };

  return {
    textSize,
    setTextSize: handleTextSizeChange,
    screenReader,
    setScreenReader: handleScreenReaderChange,
    darkMode,
    setDarkMode: handleDarkModeChange,
  };
};

export default useAccountSettings;
