import express, { Response } from 'express';
import { LoginRequest, FakeSOSocket, CreateAccountRequest, GetUserDataRequest, ProfilePagePayload, Question, Answer } from '../types';
import { createAccount, findUsersQuestions, findUsersAnswers, findUsersComments, loginToAccount, getUserScore } from '../models/application';

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
    !!req.body.username && !!req.body.hashedPassword;

  /**
   * Checks if the provided create account request contains the required fields.
   *
   * @param req The request object containing the account data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isCreateAccountRequestValid = (req: CreateAccountRequest): boolean =>
    !!req.body && req.body.username !== undefined && req.body.hashedPassword !== undefined;

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
      res.status(401).send(`ERROR: Unable to login to account: ${(err as Error).message}`);
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
      res.status(401).send(`ERROR: Unable to create account: ${(err as Error).message}`);
    }
  };

  const isDataRouteValid = (req: GetUserDataRequest): boolean =>
    !!req.body.profile.username && !!req.body.profile.hashedPassword;

  const userDataRoute = async(req: GetUserDataRequest, res: Response): Promise<void> => {
    if(!isDataRouteValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const { username } = req.body.profile;

    try {
      const questions = await findUsersQuestions(username)
      const answers = await findUsersAnswers(username)
      const comments = await findUsersComments(username)
      const score : number= await getUserScore(username);

      const payload : ProfilePagePayload =  {
        username,
        score,
        questions,
        answers,
        comments,
      }

      socket.emit('userUpdate', payload);
      res.status(200).send('data found succesfully');
    } catch (err: unknown) {
      res.status(401).send(`ERROR: Unable to retrieve account info: ${(err as Error).message}`);
    }
  }

  router.post('/login', loginRoute);
  router.post('/createAccount', createAccountRoute);
  router.post('/userData', userDataRoute)

  return router;
};

export default loginController;
