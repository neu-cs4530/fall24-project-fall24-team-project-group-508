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
    <ul className='button-list'>
      <li>
        <button className='action-button lock' onClick={handleLock}></button>
      </li>
      <li>
        <button className='action-button pin' onClick={handlePin}></button>
      </li>
      <li>
        <button className='action-button remove' onClick={handleRemove}></button>
      </li>
    </ul>
  );
};
export default ModeratorActionButtons;
