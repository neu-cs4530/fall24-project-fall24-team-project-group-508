import { Box, Button, List, ListItem } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import useModeratorActions from '../../../hooks/useModeratorActions';
import './index.css';

export interface ModeratorActionProps {
  parentID?: string;
  parentType?: 'question' | 'answer' | 'comment';
  _id?: string;
  type: 'question' | 'answer' | 'comment';
}

const ModeratorActionButtons = (
  info: ModeratorActionProps,
  _id: string | undefined,
): JSX.Element => {
  const { handlePin, handleLock, handleRemove } = useModeratorActions(info, _id);
  return (
    <Box component='nav' aria-label='Moderator actions'>
      <List
        sx={{
          display: 'flex',
          gap: 1,
          padding: 0,
          listStyleType: 'none',
          flexDirection: 'column',
        }}>
        {info.type !== 'comment' ? (
          <ListItem disablePadding>
            <Button
              variant='outlined'
              color='secondary'
              onClick={handleLock}
              aria-label='Lock content'
              sx={{ minWidth: 'auto', padding: '4px' }}>
              <LockIcon fontSize='small' />
            </Button>
          </ListItem>
        ) : (
          <></>
        )}
        <ListItem disablePadding>
          <Button
            variant='outlined'
            color='primary'
            onClick={handlePin}
            aria-label='Pin content'
            sx={{ minWidth: 'auto', padding: '4px' }}>
            <PushPinIcon fontSize='small' />
          </Button>
        </ListItem>
        <ListItem disablePadding>
          <Button
            variant='outlined'
            color='error'
            onClick={handleRemove}
            aria-label='Remove content'
            sx={{ minWidth: 'auto', padding: '4px' }}>
            <DeleteIcon fontSize='small' />
          </Button>
        </ListItem>
      </List>
    </Box>
  );
};
export default ModeratorActionButtons;
