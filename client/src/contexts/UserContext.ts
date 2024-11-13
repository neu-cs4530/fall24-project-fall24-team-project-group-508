import { createContext } from 'react';
import { FakeSOSocket, User, Account } from '../types';

/**
 * Interface represents the context type for user-related data and a WebSocket connection.
 *
 * - user - the current user.
 * - account - the account associated with the current user.
 * - socket - the WebSocket connection associated with the current user.
 */
export interface UserContextType {
  user: User;
  account: Account;
  socket: FakeSOSocket;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
