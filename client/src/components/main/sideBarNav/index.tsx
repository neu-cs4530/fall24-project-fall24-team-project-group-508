import React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import useUserContext from '../../../hooks/useUserContext';

/**
 * The SideBarNav component has two menu items: "Questions" and "Tags".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => {
  const theme = useTheme();
  const user = useUserContext();

  return (
    <div
      id='sideBarNav'
      style={{
        width: 150,
        padding: '10px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        textAlign: 'center', // Center text alignment for the entire sidebar
      }}>
      <List>
        {/* Welcome Text */}
        <ListItem disablePadding>
          <Typography
            variant='h6'
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: theme.palette.primary.main, // Set the color to blue (for 'Welcome')
            }}>
            Welcome
          </Typography>
        </ListItem>

        {/* Username */}
        <ListItem disablePadding>
          <Typography
            variant='h6'
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: theme.palette.text.primary, // Set the color to black (for username)
            }}>
            {user.account.username}
          </Typography>
        </ListItem>

        {/* User Type */}
        <ListItem disablePadding>
          <Typography
            variant='body2'
            sx={{
              textAlign: 'center',
              color: theme.palette.grey[500], // Lighter grey color for user type
              marginTop: '4px',
            }}>
            {user.account.userType}
          </Typography>
        </ListItem>

        {/* Navigation Links */}
        <ListItem disablePadding>
          <NavLink
            to='/home'
            style={({ isActive }) => ({
              'textDecoration': 'none',
              'color': isActive ? theme.palette.primary.main : theme.palette.text.secondary,
              'backgroundColor': isActive ? theme.palette.primary.light : 'transparent',
              'borderRadius': '5px',
              'padding': '5px 10px',
              'transition': 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: isActive
                  ? theme.palette.primary.light
                  : theme.palette.action.hover,
              },
            })}>
            <ListItemButton>
              <ListItemText primary='Questions' />
            </ListItemButton>
          </NavLink>
        </ListItem>

        <ListItem disablePadding>
          <NavLink
            to='/tags'
            style={({ isActive }) => ({
              'textDecoration': 'none',
              'color': isActive ? theme.palette.primary.main : theme.palette.text.secondary,
              'backgroundColor': isActive ? theme.palette.primary.light : 'transparent',
              'borderRadius': '5px',
              'padding': '5px 10px',
              'transition': 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: isActive
                  ? theme.palette.primary.light
                  : theme.palette.action.hover,
              },
            })}>
            <ListItemButton>
              <ListItemText primary='Tags' />
            </ListItemButton>
          </NavLink>
        </ListItem>
      </List>
    </div>
  );
};

export default SideBarNav;
