import React from 'react';
import './index.css';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideBarNav from '../main/sideBarNav';
import Header from '../header';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 */
const Layout = () => (
  <>
    <Header />
    <Box
      id='main'
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        minHeight: '100vh',
      }}>
      {/* Sidebar Navigation */}
      <Box
        component='nav'
        sx={{
          width: 250,
          bgcolor: 'background.paper',
          p: 2,
          borderRight: 1,
          borderColor: 'divider',
        }}>
        <SideBarNav />
      </Box>

      {/* Main Content Area */}
      <Box
        id='right_main'
        component='main'
        sx={{
          flexGrow: 1,
          padding: 2,
        }}
        role='main'>
        <Outlet />
      </Box>
    </Box>
  </>
);

export default Layout;
