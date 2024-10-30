import express, { Response } from 'express';
import { LoginRequest, FakeSOSocket, CreateAccountRequest } from '../types';
import { createAccount, loginToAccount } from '../models/application';
const loginController = (socket: FakeSOSocket) => {
  const router = express.Router();
  /**
   * Checks if the provided login request contains the required fields.
   *
   * @param req The request object containing the login data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isLoginRequestValid = (req: LoginRequest): boolean =>
    !!req.body.username &&
    !!req.body.hashedPassword
  /**
   * Checks if the provided create account request contains the required fields.
   *
   * @param req The request object containing the account data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isCreateAccountRequestValid = (req: CreateAccountRequest) : boolean =>
    !!req.body && 
    req.body.username !== undefined &&
    req.body.hashedPassword !== undefined
  /**
   * Handles adding logging in to a specified account. If the request is invalid or the login fails, an error will be returns
   *
   * @param req The LoginRequest object containing the account data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const loginRoute = async (req: LoginRequest, res: Response): Promise<void> => {
    if (!isLoginRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    const { username, hashedPassword } = req.body;
    try {
      const account = await loginToAccount(username, hashedPassword);
      if ('error' in account) {
        throw new Error(account.error);
      }
      res.json(account);
    } catch (err: unknown) {
      res.status(401).send(`${(err as Error).message}`);
    }
  };
  /**
   * Handles account creation and adding the new account onto the server. If the request is invalid or the creation fails, an error will be returns
   *
   * @param req The CreateAccountRequest object containing the account that will be created.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const createAccountRoute = async (req: CreateAccountRequest, res: Response): Promise<void> => {
    if (!isCreateAccountRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    const account = req.body;
    try {
      const newAccount = await createAccount(account);
      if ('error' in newAccount) {
        throw new Error(newAccount.error);
      }
      res.json(newAccount);
    } catch (err: unknown) {
      res.status(401).send(`${(err as Error).message}`);
    }
  };
  router.post('/login', loginRoute);
  router.post('/createAccount', createAccountRoute);
  return router;
};
export default loginController;