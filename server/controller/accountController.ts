import express, { Request, Response } from 'express';
import { FakeSOSocket, UpdateSettingRequest } from '../types'; // Import the correct request type
import { updateAccountSettings } from '../models/application'; // Import the model function to update settings

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

  // Define the route for updating settings
  router.put('/settings/:accountId', updateSettingsRoute);

  // router.put('/settings/:accountId', async (req, res) => {
  //   const { accountId } = req.params;
  //   const settings = req.body;

  //   try {
  //     const updatedAccount = await updateAccountSettings(accountId, settings);
  //     res.json(updatedAccount);
  //   } catch (error) {
  //     res.status(500).json({ message: error });
  //   }
  // });

  return router;
};

export default accountController;
