/* eslint-disable no-console */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import './index.css';
import { useThemeContext } from '../../../contexts/ThemeContext';
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

  const { currentTheme, switchTheme } = useThemeContext();

  const handleThemeChange = async (e: SelectChangeEvent<string>) => {
    const newTheme = e.target.value as
      | 'light'
      | 'dark'
      | 'northeastern'
      | 'oceanic'
      | 'highContrast'
      | 'colorblindFriendly';
    switchTheme(newTheme);

    if (account && account._id && setAccount) {
      const updatedAccount = await updateAccountSettings(account._id, {
        ...account.settings,
        theme: newTheme,
      });
      setAccount(updatedAccount);
    } else {
      console.error('Account ID is undefined');
    }
  };

  const handleTextChange = async (e: SelectChangeEvent<string>) => {
    const newSize = e.target.value as 'small' | 'medium' | 'large';
    setTextSize(newSize);

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
    <Dialog open onClose={onClose} aria-labelledby='accessibility-dialog-title'>
      <DialogTitle id='accessibility-dialog-title' sx={{ fontSize: '1.5rem', padding: '16px' }}>
        Accessibility Options
      </DialogTitle>
      <DialogContent sx={{ padding: '16px 24px' }}>
        <FormControl fullWidth margin='normal'>
          <InputLabel id='text-size-label' sx={{ fontSize: '1.5rem', color: 'inherit' }}>
            Text Size
          </InputLabel>
          <Select
            labelId='text-size-label'
            value={textSize}
            onChange={handleTextChange}
            sx={{ marginTop: '25px', fontSize: '1rem' }}>
            <MenuItem value='small'>Small</MenuItem>
            <MenuItem value='medium'>Medium</MenuItem>
            <MenuItem value='large'>Large</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin='normal'>
          <InputLabel id='text-size-label' sx={{ fontSize: '1.5rem', color: 'inherit' }}>
            Theme
          </InputLabel>
          <Select
            labelId='text-size-label'
            value={currentTheme}
            onChange={handleThemeChange}
            sx={{ marginTop: '25px', fontSize: '1rem' }}>
            <MenuItem value='light'>Light</MenuItem>
            <MenuItem value='dark'>Dark</MenuItem>
            <MenuItem value='northeastern'>Northeastern</MenuItem>
            <MenuItem value='oceanic'>Oceanic</MenuItem>
            <MenuItem value='highContrast'>High Contrast</MenuItem>
            <MenuItem value='colorblindFriendly'>Colorblind Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          onClick={onClose}
          variant='contained'
          color='primary'
          sx={{ marginTop: '24px', fontSize: '1rem', padding: '8px 16px' }}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityPopup;
