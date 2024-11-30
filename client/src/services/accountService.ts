import { Account } from '../types'; // Import the Account type
import api from './config';

const ACCOUNT_API_URL = `${process.env.REACT_APP_SERVER_URL}/account`;

/**
 * Updates the settings of an account.
 *
 * @param accountId - The ID of the account whose settings are being updated.
 * @param settings - The settings object containing the changes to be made (darkMode, textSize, screenReader).
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const updateSettings = async (
  accountId: string,
  settings: Account['settings'],
): Promise<Account> => {
  const data = { settings }; // Only send the settings in the body, since we're updating settings specifically.

  try {
    const res = await api.put(`${ACCOUNT_API_URL}/settings/${accountId}`, data);
    if (res.status !== 200) {
      throw new Error("Error while updating an account's settings");
    }
    return res.data; // Assuming the API returns the updated account data.
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

/**
 * Updates account settings by making a request to the server.
 *
 * @param accountId The ID of the account to update.
 * @param settings The settings to update.
 * @returns The updated account object.
 */
export const updateAccountSettings = async (
  accountId: string,
  settings: Account['settings'],
): Promise<Account> => {
  const response = await fetch(`${ACCOUNT_API_URL}/settings/${accountId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error('Failed to update account settings');
  }

  const updatedAccount = await response.json();
  return updatedAccount;
};

/**
 * Updates account settings by making a request to the server.
 *
 * @param accountId The ID of the account to update.
 * @param settings The settings to update.
 * @returns The updated account object.
 */
export const updateUserTypes = async (accountId: string, userType: string): Promise<Account> => {
  const payload = { userType };

  const response = await fetch(`${ACCOUNT_API_URL}/userType/${accountId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update account settings');
  }

  const updatedAccount = await response.json();
  return updatedAccount;
};

/**
 * Fetches all accounts from the server.
 *
 * @returns An array of account objects.
 */
export const getAccounts = async (): Promise<Account[]> => {
  const response = await fetch(`${ACCOUNT_API_URL}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch accounts');
  }
  const accounts = await response.json();
  return accounts;
};

export const getAccountByName = async (userName: string): Promise<Account> => {
  const response = await fetch(`${ACCOUNT_API_URL}/${userName}`);
  if (!response.ok) {
    throw new Error('Failed to fetch account');
  }
  const account = await response.json();
  return account;
};
export default updateSettings;
