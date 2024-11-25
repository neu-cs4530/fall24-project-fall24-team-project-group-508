import express, { Response } from 'express';
import { Answer, AnswerRequest, AnswerResponse, FakeSOSocket } from '../types';
import {
  addAnswerToQuestion,
  markAnswerCorrect,
  populateDocument,
  saveAnswer,
} from '../models/application';

const answerController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: AnswerRequest): boolean {
    return !!req.body.qid && !!req.body.ans;
  }

  /**
   * Checks if the provided answer contains the required fields.
   *
   * @param ans The answer object to validate.
   *
   * @returns `true` if the answer is valid, otherwise `false`.
   */
  function isAnswerValid(ans: Answer): boolean {
    return !!ans.text && !!ans.ansBy && !!ans.ansDateTime;
  }

  /**
   * Adds a new answer to a question in the database. The answer request and answer are
   * validated and then saved. If successful, the answer is associated with the corresponding
   * question. If there is an error, the HTTP response's status is updated.
   *
   * @param req The AnswerRequest object containing the question ID and answer data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addAnswer = async (req: AnswerRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isAnswerValid(req.body.ans)) {
      res.status(400).send('Invalid answer');
      return;
    }

    const { qid } = req.body;
    const ansInfo: Answer = req.body.ans;
    ansInfo.locked = false;
    ansInfo.pinned = false;

    try {
      const ansFromDb = await saveAnswer(ansInfo);

      if ('error' in ansFromDb) {
        throw new Error(ansFromDb.error as string);
      }

      const status = await addAnswerToQuestion(qid, ansFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      const populatedAns = await populateDocument(ansFromDb._id?.toString(), 'answer');

      if (populatedAns && 'error' in populatedAns) {
        throw new Error(populatedAns.error as string);
      }

      // Populates the fields of the answer that was added and emits the new object
      socket.emit('answerUpdate', {
        qid,
        answer: populatedAns as AnswerResponse,
        removed: false,
      });
      res.json(ansFromDb);
    } catch (err) {
      res.status(500).send(`Error when adding answer: ${(err as Error).message}`);
    }
  };

  /**
   * Updates an existing answer in the database.
   *
   * @param req The AnswerRequest object containing the answer ID and updated answer data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const markAnswerCorrectRoute = async (req: AnswerRequest, res: Response): Promise<void> => {
    const { qid, ans } = req.body;

    if (!qid || !isAnswerValid(ans)) {
      res.status(400).send('Invalid request or answer');
      return;
    }

    const ansId = String(ans._id);
    const ansCorrect = ans.isCorrect;
    try {
      // Update the answer in the database
      const updatedAnswer = await markAnswerCorrect(ansId, ansCorrect);

      if ('error' in updatedAnswer) {
        throw new Error(updatedAnswer.error as string);
      }

      // Emit the updated answer to connected clients
      socket.emit('answerUpdate', {
        qid, // Ensure the answer contains the question ID
        answer: updatedAnswer as Answer,
        removed: false,
      });

      res.json(updatedAnswer);
    } catch (err) {
      res.status(500).send(`Error when updating answer: ${(err as Error).message}`);
    }
  };

  // Add the updateAnswer endpoint
  router.put('/updateCorrectAnswer', markAnswerCorrectRoute);

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/addAnswer', addAnswer);

  return router;
};

export default answerController;
