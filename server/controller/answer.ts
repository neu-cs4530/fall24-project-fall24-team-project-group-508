import express, { Response } from 'express';
import { Answer, AnswerRequest, AnswerResponse, DraftAnswerRequest, FakeSOSocket, FindAnswerByIdRequest, FindDraftByIdRequest, SaveAnswerAsDraftRequest } from '../types';
import { addAnswerToQuestion, markAnswerCorrect, checkIfExists, fetchAnswerById, fetchAnswerDraftById, populateDocument, removeAnswerDraft, removeOriginalDraftAnswer, saveAnswer, saveAnswerDraft, saveAnswerFromDraft, updateAnswer } from '../models/application';
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
          await removeAnswerDraft(ans);
        } else {
          await updateAnswer(ans);
          res.status(200).send('updated!');
        }
      } catch(err) {
        res.status(500).send(`Error when updating question: ${(err as Error).message}`);
      }
    }

    const saveAsDraft = async (req: SaveAnswerAsDraftRequest, res: Response): Promise<void> => {
      if (!req.body.draft || !req.body.username || !req.body.qid) {
        res.status(400).send('Invalid question save request');
        return;
      }
      const answer: Answer = req.body.draft;
  
      try {
        await saveAnswerDraft(req.body.username, answer, req.body.qid);
      } catch(err) {
        res.status(500).send(`Error when saving answer: ${(err as Error).message}`);
      }
  
    }


  const getDraftAnswerById = async (req: FindDraftByIdRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      const { username } = req.query;
  
      if (!ObjectId.isValid(id)) {
        res.status(400).send('Invalid ID format');
        return;
      }
  
      if (username === undefined) {
        res.status(400).send('Invalid username requesting question.');
        return;
      }
  
      try {
        const q = await fetchAnswerDraftById(id, username);
  
        if (q && !('error' in q)) {
          res.json(q);
          return;
        }
  
        throw new Error('Error while fetching question by id');
      } catch (err: unknown) {
        if (err instanceof Error) {
          res.status(500).send(`Error when fetching question by id: ${err.message}`);
        } else {
          res.status(500).send(`Error when fetching question by id`);
        }
      }
    };


    const saveFromDraft = async (req: DraftAnswerRequest, res: Response): Promise<void> => {
      if (!req.body.draftAnswer) {
        res.status(400).send('Invalid question save request');
        return;
      }
  
      const draftA: Answer = req.body.draftAnswer;
  
      try {
        await saveAnswerFromDraft(draftA);
      } catch(err) {
        res.status(500).send(`Error when saving question: ${(err as Error).message}`);
      }
    }
  
    const postFromDraft = async (req: DraftAnswerRequest, res: Response): Promise<void> => {
      //simply delete previous post, and post the question inside the draft. Use the realid, if its not real, then just proceed as a post
      console.log(req.body)
      if (!req.body.draftAnswer || !req.body.username || !req.body.qid) {
        res.status(400).send('Invalid question save request');
        return;
      }
  
      const answer: Answer = req.body.draftAnswer;
  
      answer.locked = false;
      answer.pinned = false;
      answer.draft = false;
      try {
        if(req.body.realId) {
          await removeOriginalDraftAnswer(req.body.realId);
        }
  
        if(req.body.draftAnswer._id) {
          await removeOriginalDraftAnswer(req.body.draftAnswer._id.toString());
        }
  
        if (!answer.text) {
          res.status(400).send('Invalid question body');
          return;
        }
        const result = await saveAnswer(answer);
        if ('error' in result) {
          throw new Error(result.error);
        }
  
        await addAnswerToQuestion(req.body.qid, result);
  
  
      await removeAnswerDraft(req.body.draftAnswer);
      res.status(200).send('Draft has been posted!');
  
    }catch(err) {
        res.status(500).send(`Error when saving question: ${(err as Error).message}`);
    }
  }
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
    const ansCorrect = !ans.isCorrect;
    try {
      // Update the answer in the database
      const updatedAnswer = await markAnswerCorrect(ansId, ansCorrect);
      socket.emit('answerUpdate', {
        qid,
        answer: updatedAnswer as AnswerResponse,
        removed: false,
      });
      if ('error' in updatedAnswer) {
        throw new Error(updatedAnswer.error as string);
      }

      res.json(updatedAnswer);
    } catch (err) {
      res.status(500).send(`Error when updating answer: ${(err as Error).message}`);
    }
  };

  // Add the updateAnswer endpoint
  router.put('/updateCorrectAnswer', markAnswerCorrectRoute);

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/addAnswer', addAnswer);
  router.get('/getAnswerById/:id', getAnswerById);
  router.post('/updateAnswer', updateAnswerRoute);
  router.post('/saveDraft', saveAsDraft);
  router.get('/getDraftAnswerById/:id', getDraftAnswerById);
  router.post('/saveFromDraft', saveFromDraft)
  router.post('/postFromDraft', postFromDraft)

  return router;
};

export default answerController;
