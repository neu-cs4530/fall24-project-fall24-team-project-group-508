import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, IconButton, Box, Button } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import useHeader from '../../hooks/useHeader';
import AccessibilityPopup from './settings';
import UserContext from '../../contexts/UserContext';
import OwnerPopup from './rolesPopup';
import logo from './logo.png';

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
        <Box flexGrow={1} display='flex' alignItems='center'>
          <img src={logo} style={{ height: 40, marginRight: 10 }} />
          <Typography variant='h6' component='div'>
            Husky404
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
