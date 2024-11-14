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
    const res = await api.post(`${ACCOUNT_API_URL}/${accountId}/updateSettings`, data);
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
  const response = await fetch(`/api/account/settings/${accountId}`, {
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

export default updateSettings;
