import { createContext } from 'react';
import { Account, User } from '../types';

/**
 * Interface representing the context type for user login management.
 *
 * - setUser - A function to update the current user in the context,
 *             which take User object representing the logged-in user or null
 *             to indicate no user is logged in.
 * - setAccount - A function to update the current account in the context,
 *               which take Account object representing the logged-in account or null
 *              to indicate no account is logged in.
 */
export interface LoginContextType {
  setUser: (user: User | null) => void;
  setAccount: (account: Account | null) => void;
}

const LoginContext = createContext<LoginContextType | null>(null);

export default LoginContext;
