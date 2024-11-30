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
      <Box sx={{ m: 4 }}>
        {<PersonOutlineIcon sx={{ width: 400, height: 400 }}></PersonOutlineIcon>}
        <Box>
          <label style={{ fontSize: 50 }}>name: {user.username}</label>
        </Box>
        <Box>
          <label style={{ fontSize: 50 }}>score: {score} </label>
        </Box>
      </Box>
      <Box>
        <AccountPostList></AccountPostList>
      </Box>
    </div>
  );
};

export default ProfilePage;
