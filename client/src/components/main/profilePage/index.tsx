import './index.css';
import { Box, useTheme } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccountPostList from './AccountPostList';
import useProfilePage from '../../../hooks/useProfilePage';

/**
 * ProfilePage component that displays the full content of a profile, with that user's q/a/c's
 */
const ProfilePage = () => {
  const { score, user } = useProfilePage();
  const theme = useTheme();

  return (
    <div
      className='profile-page'
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          m: 4,
        }}>
        {/* Left Section: Profile Picture */}
        <PersonOutlineIcon sx={{ width: 300, height: 300, color: theme.palette.primary.main }} />

        {/* Right Section: Name and Score */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box>
            <label style={{ fontSize: 50 }}>name: {user.username}</label>
          </Box>
          <Box>
            <label style={{ fontSize: 50 }}>score: {score}</label>
          </Box>
        </Box>
      </Box>
      <Box>
        <AccountPostList></AccountPostList>
      </Box>
    </div>
  );
};

export default ProfilePage;
