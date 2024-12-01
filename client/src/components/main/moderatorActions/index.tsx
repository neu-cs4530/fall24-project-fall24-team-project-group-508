import { Box, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import useModeratorActions from '../../../hooks/useModeratorActions';
import './index.css';

/**
 * Interface representing the props for the ModeratorActionButtons component.
 *
 * - parentID: The ID of the parent component.
 * - parentType: The type of the parent component.
 * - _id: The ID of the component.
 * - type: The type of the component.
 */
export interface ModeratorActionProps {
  parentID?: string;
  parentType?: 'question' | 'answer' | 'comment';
  _id?: string;
  type: 'question' | 'answer' | 'comment';
}

/**
 * ModeratorActionButtons component that displays the moderator action buttons.
 * It includes buttons to pin, lock, and remove content.
 * @param info Information about the moderator.
 * @param _id The ID of the component.
 */
const ModeratorActionButtons = (
  info: ModeratorActionProps,
  _id: string | undefined,
): JSX.Element => {
  const { handlePin, handleLock, handleRemove } = useModeratorActions(info, _id);
  return (
    <Box
      component='nav'
      aria-label='Moderator actions'
      sx={{
        // display: 'inline-block', // Makes the container inline
        whiteSpace: 'nowrap', // Prevents wrapping
        display: 'flex',
        flexDirection: info.type === 'answer' ? 'column' : 'row', // Vertical for answers, horizontal otherwise
      }}>
      {info.type !== 'comment' && (
        <Button
          variant='outlined'
          color='secondary'
          onClick={handleLock}
          aria-label='Lock content'
          sx={{ margin: '0 4px', padding: '4px' }}>
          <LockIcon fontSize='small' />
        </Button>
      )}
      <Button
        variant='outlined'
        color='primary'
        onClick={handlePin}
        aria-label='Pin content'
        sx={{ margin: '4px 4px', padding: '4px' }}>
        <PushPinIcon fontSize='small' />
      </Button>
      <Button
        variant='outlined'
        color='error'
        onClick={handleRemove}
        aria-label='Remove content'
        sx={{ margin: '0px 4px', padding: '4px' }}>
        <DeleteIcon fontSize='small' />
      </Button>
    </Box>
  );
};
export default ModeratorActionButtons;
