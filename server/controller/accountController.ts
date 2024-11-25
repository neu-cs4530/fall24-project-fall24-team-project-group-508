import express, { Request, Response } from 'express';
import { FakeSOSocket, UpdateSettingRequest } from '../types'; // Import the correct request type
import {
  getAccount,
  getAccounts,
  updateAccountSettings,
  updateUserType,
} from '../models/application'; // Import the model function to update settings

const accountController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided update settings request contains the required fields.
   *
   * @param req The request object containing the settings data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isSettingRequestValid = (req: UpdateSettingRequest): boolean =>
    req.body &&
    typeof req.body.darkMode === 'boolean' &&
    (req.body.textSize === 'small' ||
      req.body.textSize === 'medium' ||
      req.body.textSize === 'large') &&
    typeof req.body.screenReader === 'boolean';

  /**
   * Handles updating settings for an account. If the request is invalid, an error is returned.
   *
   * @param req The request object containing the updated settings data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateSettingsRoute = async (req: Request, res: Response): Promise<void> => {
    const { accountId } = req.params; // Get the account ID from the route params
    const settings = req.body; // Get the settings from the request body

    // Validate the request
    if (!isSettingRequestValid(req)) {
      res.status(400).send('Invalid settings request');
      return;
    }

    try {
      // Call the model to update the account settings
      const updatedAccount = await updateAccountSettings(accountId, settings);

      // Send back the updated account details
      res.status(200).json(updatedAccount);
    } catch (err: unknown) {
      // Handle errors, such as account not found or any database issues
      res
        .status(500)
        .send(`ERROR: Unable to update settings for account: ${(err as Error).message}`);
    }
  };

  const getAccountsRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const accounts = await getAccounts();
      res.status(200).json(accounts);
    } catch (err: unknown) {
      res.status(500).send(`ERROR: Unable to get accounts: ${(err as Error).message}`);
    }
  };

  // Helper function to validate user type
  const isValidUserType = (type: string): boolean => ['owner', 'moderator', 'user'].includes(type);

  /**
   * Endpoint to update a user's type
   * PUT /account/update-user-type/:username
   */
  const updateUserTypeRoute = async (req: Request, res: Response): Promise<void> => {
    const { userID } = req.params;
    const { userType } = req.body;

    // Validate the user type
    if (!userType || !isValidUserType(userType)) {
      res.status(400).json({ message: 'Invalid user type' });
      return;
    }

    try {
      // Call the model function to update the user type
      const updatedAccount = await updateUserType(userID, userType);

      if (!updatedAccount) {
        res.status(404).json({ message: 'Account not found' });
        return;
      }

      // Return the updated account
      res.status(200).json(updatedAccount);
    } catch (err) {
      res
        .status(500)
        .json({ message: `ERROR: Unable to update user type: ${(err as Error).message}` });
    }
  };

  const getAccountRoute = async (req: Request, res: Response): Promise<void> => {
    const { userName } = req.params;
    try {
      const account = await getAccount(userName);
      res.status(200).json(account);
    } catch (err) {
      res.status(500).json({ message: `ERROR: Unable to get account: ${(err as Error).message}` });
    }
  };

  router.get('/:userName', getAccountRoute);

  // Define the PUT route for updating user types
  router.put('/userType/:userID', updateUserTypeRoute);

  // Define the route for updating settings
  router.get('/', getAccountsRoute);
  router.put('/settings/:accountId', updateSettingsRoute);

  return router;
};

export default accountController;
