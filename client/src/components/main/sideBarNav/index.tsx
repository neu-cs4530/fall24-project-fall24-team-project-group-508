import React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemText, useTheme } from '@mui/material';

/**
 * The SideBarNav component has two menu items: "Questions" and "Tags".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => {
  const theme = useTheme();

  return (
    <div
      id='sideBarNav'
      style={{
        width: 150,
        padding: '10px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}>
      <List>
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
              'color': isActive
                ? theme.palette.primary.main // Active link color (blue)
                : theme.palette.text.secondary, // Inactive link color (gray)
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
