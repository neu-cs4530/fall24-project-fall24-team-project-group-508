import express, { Response } from 'express';
import { Answer, AnswerRequest, AnswerResponse, FakeSOSocket, FindAnswerByIdRequest } from '../types';
import { addAnswerToQuestion, checkIfExists, fetchAnswerById, populateDocument, saveAnswer, updateAnswer } from '../models/application';
import { ObjectId } from 'mongodb';

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
   * Retrieves a question by its unique ID, and increments the view count for that answer.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindAnswerByIdRequest object containing the answer ID as a parameter.
   * @param res The HTTP response object used to send back the answer details.
   *
   * @returns A Promise that resolves to void.
   */
    const getAnswerById = async (req: FindAnswerByIdRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      const { username } = req.query;
  
      if (!ObjectId.isValid(id)) {
        res.status(400).send('Invalid ID format');
        return;
      }
  
      if (username === undefined) {
        res.status(400).send('Invalid username requesting answer.');
        return;
      }
  
      try {
        const a = await fetchAnswerById(id, username);
  
        if (a && !('error' in a)) {
          res.json(a);
          return;
        }
  
        throw new Error('Error while fetching answer by id');
      } catch (err: unknown) {
        if (err instanceof Error) {
          res.status(500).send(`Error when fetching answer by id: ${err.message}`);
        } else {
          res.status(500).send(`Error when fetching answer by id`);
        }
      }
    };

    const updateAnswerRoute = async (req: AnswerRequest, res: Response): Promise<void> => {
      const { ans } = req.body;
      console.log(req.body)
      if (!isAnswerValid(ans)) {
        res.status(400).send('Invalid question body');
        return;
      }
      try {
        if(!ans._id || await !checkIfExists(ans._id.toString(), "answer")) {
          await addAnswer(req, res)
        } else {
          await updateAnswer(ans);
          res.status(200).send('updated!');
        }
      } catch(err) {
        res.status(500).send(`Error when updating question: ${(err as Error).message}`);
      }
    }

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/addAnswer', addAnswer);
  router.get('/getAnswerById/:id', getAnswerById);
  router.post('/updateAnswer', updateAnswerRoute)

  return router;
};

export default answerController;
