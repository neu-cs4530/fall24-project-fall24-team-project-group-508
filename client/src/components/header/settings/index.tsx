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
  Box,
} from '@mui/material';
import ReadPageButton from '../../main/ttsButton';
import { Account } from '../../../types';
import { updateAccountSettings } from '../../../services/accountService';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useTextSize } from '../../../contexts/TextSizeContext';

interface AccessibilityPopupProps {
  account?: Account;
  setAccount?: (updatedAccount: Account | null) => void;
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
      | 'colorblindFriendly'
      | 'greyscale';
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
          <InputLabel id='theme-label' sx={{ fontSize: '1.5rem', color: 'inherit' }}>
            Theme
          </InputLabel>
          <Select
            labelId='theme-label'
            value={currentTheme}
            onChange={handleThemeChange}
            sx={{ marginTop: '25px', fontSize: '1rem' }}>
            <MenuItem value='light'>Light</MenuItem>
            <MenuItem value='dark'>Dark</MenuItem>
            <MenuItem value='northeastern'>Northeastern</MenuItem>
            <MenuItem value='oceanic'>Oceanic</MenuItem>
            <MenuItem value='highContrast'>High Contrast</MenuItem>
            <MenuItem value='colorblindFriendly'>Colorblind Friendly</MenuItem>
            <MenuItem value='greyscale'>Greyscale</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'block', marginTop: '24px' }}>
          <ReadPageButton />
        </Box>

        <Box sx={{ display: 'block', marginTop: '16px' }}>
          <Button
            onClick={onClose}
            variant='contained'
            color='primary'
            sx={{ fontSize: '1rem', padding: '8px 16px' }}>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityPopup;
