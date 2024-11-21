import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, IconButton, Box, Button } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import useHeader from '../../hooks/useHeader';
import AccessibilityPopup from './settings';
import UserContext from '../../contexts/UserContext'; // Adjust the path to your AccountContext
import OwnerPopup from './rolesPopup';

/**
 * Header component with live search functionality.
 */
const Header = () => {
  const { val, handleInputChange } = useHeader();
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);
  const [isOwnerPopupOpen, setIsOwnerPopupOpen] = useState(false);
  const userContextValue = useContext(UserContext);
  const account = userContextValue?.account;
  const setAccount = userContextValue?.setAccount;

  const toggleSettingsPopup = () => {
    setIsSettingsPopupOpen(!isSettingsPopupOpen);
  };

  const toggleOwnerPopup = () => {
    setIsOwnerPopupOpen(!isOwnerPopupOpen);
  };

  return (
    <AppBar position='fixed'>
      <Toolbar>
        <Box flexGrow={1}>
          <Typography variant='h6' component='div'>
            Fake Stack Overflow
          </Typography>
        </Box>

        <TextField
          id='searchBar'
          placeholder='Search ...'
          type='text'
          value={val}
          onChange={handleInputChange}
          variant='outlined'
          size='small'
          sx={{
            input: {
              color: 'white',
            },
          }}
        />

        {account && account.userType === 'owner' && (
          <Button
            variant='contained'
            color='primary'
            onClick={toggleOwnerPopup}
            sx={{ mx: 2 }} // Adds horizontal margin
          >
            Manage Accounts
          </Button>
        )}
        {isOwnerPopupOpen && account && setAccount && <OwnerPopup onClose={toggleOwnerPopup} />}

        <IconButton
          onClick={toggleSettingsPopup}
          aria-label='Open accessibility settings'
          color='inherit'>
          <SettingsIcon />
        </IconButton>

        {isSettingsPopupOpen && account && setAccount && (
          <AccessibilityPopup
            account={account}
            setAccount={setAccount}
            onClose={toggleSettingsPopup}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
