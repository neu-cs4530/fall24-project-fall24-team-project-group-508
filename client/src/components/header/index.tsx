import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, IconButton, Box } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import useHeader from '../../hooks/useHeader';
import AccessibilityPopup from './settings';
import UserContext from '../../contexts/UserContext'; // Adjust the path to your AccountContext

/**
 * Header component with live search functionality.
 */
const Header = () => {
  const { val, handleInputChange } = useHeader();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const userContextValue = useContext(UserContext);
  const account = userContextValue?.account;
  const setAccount = userContextValue?.setAccount;

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <AppBar position='static'>
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

        <IconButton onClick={togglePopup} aria-label='Open accessibility settings' color='inherit'>
          <SettingsIcon />
        </IconButton>

        {isPopupOpen && account && setAccount && (
          <AccessibilityPopup account={account} setAccount={setAccount} onClose={togglePopup} />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
