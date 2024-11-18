import takeUserAction, { TakeActionRequestBody } from '../services/actionService';
// import useLoginContext from './useLoginContext';
// import { User } from '../types';

/**
 * Custom hook to clean up moderator actions code :)
 *
 * @returns context - Returns the user context object, which contains user and socket information.
 *
 * @throws it will throw an error if the context is not found or is null.
 */
const useModeratorActions = (
  info: {
    parentID?: string;
    parentType?: 'question' | 'answer' | 'comment';
    type: 'question' | 'answer' | 'comment';
  },
  _id: string | undefined,
) => {
  const { parentID, parentType, type } = info;
  const id = _id;

  const handleAction = async (action: 'pin' | 'remove' | 'lock') => {
    if (!id) {
      throw new Error('no ID');
    }

    const data: TakeActionRequestBody = {
      user: { username: 'a', hashedPassword: 'hi', email: 'a@a' },
      actionType: action,
      postType: type,
      postID: id,
      parentID,
      parentPostType: parentType,
    };
    await takeUserAction(data);
  };

  const handlePin = async () => {
    await handleAction('pin');
  };

  const handleRemove = async () => {
    await handleAction('remove');
  };

  const handleLock = async () => {
    await handleAction('lock');
  };

  return { handlePin, handleRemove, handleLock };
};
export default useModeratorActions;
