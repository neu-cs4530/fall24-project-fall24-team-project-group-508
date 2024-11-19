import express, { Response } from 'express';
import { ActionRequest, FakeSOSocket, ActionTypes, ActionResponse, Question, AnswerResponse } from '../types';
import { canPerformActions, createAccount, lockPost, loginToAccount, pinPost, populateDocument, removePost } from '../models/application';
const actionsController = (socket: FakeSOSocket) => {
  const router = express.Router();
  
  /**
   * Checks if the provided login request contains the required fields.
   *
   * @param req The request object containing the login data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isActionRequestValid = (req: ActionRequest): boolean =>
    !!req.body.user &&
    !!req.body.actionType &&
    !!req.body.postType &&
    !!req.body.postID

  const isActionRequestCorrect = (postType : string) : boolean => {
    return (postType === 'question' || postType === 'answer' || postType === 'comment');
  }
    
  /**
   * Handles account creation and adding the new account onto the server. If the request is invalid or the creation fails, an error will be returns
   *
   * @param req The CreateAccountRequest object containing the account that will be created.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const takeActionRoute = async (req: ActionRequest, res: Response): Promise<void> => {
    if (!isActionRequestValid(req)) {
      res.status(400).send('Invalid Action request, request must include a user, action type, post type and post id');
      return;
    }

    if (!isActionRequestCorrect(req.body.postType)) {
      res.status(400).send('incorrect information in action request, must correctly specifiy a post type and action type');
      return;
    }

    const actionInfo = req.body;

    // const canTakeAction = await canPerformActions(actionInfo.user);

    // if(!canTakeAction) {
    //   res.status(401).send('YOU DO NOT HAVE PERMISSION TO TAKE THIS ACTION');
    //   return;
    // }

    let result : ActionResponse;
    try {
      // console.log("ATTEMPTING: " + actionInfo.actionType + ", " + actionInfo.postID + ", " + actionInfo.postType + ", " + actionInfo.parentID + ", " + actionInfo.parentPostType);
      switch(actionInfo.actionType) {
        case 'pin':
          result = await pinPost(actionInfo.postType, actionInfo.postID, actionInfo.parentID, actionInfo.parentPostType);
          break;
        case 'lock':
          result = await lockPost(actionInfo.postType, actionInfo.postID);
          break;
        case 'remove':
          result = await removePost(actionInfo.postType, actionInfo.postID, actionInfo.parentID, actionInfo.parentPostType);
          break;
        case 'promote':
          res.status(501).send('Promote action is currently unimplemented. This will be changed during sprint 3');
          return;
        default:
          res.status(501).send('The action ' + actionInfo.actionType + ' is currently unsupported');
          return;
      }

      if ('error' in result) {
        throw new Error(result.error);
      }

      if('question' in result) {
        const del = actionInfo.actionType === 'remove';
        socket.emit('questionUpdate', { quest: (result['question'] as Question), removed: del});
      } else if('answer' in result && actionInfo.parentID) {
        const del = actionInfo.actionType === 'remove';
        let populatedAns = await populateDocument(result['answer']._id?.toString(), 'answer');
        if(del) {
          populatedAns = result['answer'];
        }
        socket.emit('answerUpdate', { qid: actionInfo.parentID, answer: (populatedAns as AnswerResponse), removed: del});
      } else if('comment' in result && actionInfo.parentPostType === 'answer' || actionInfo.parentPostType === 'question') {
        const populatedDoc = await populateDocument(actionInfo.parentID, actionInfo.parentPostType);
        socket.emit('commentUpdate', { type: actionInfo.parentPostType, result: populatedDoc});
      }

      res.status(200).json('action completed succesfully');
    } catch (err: unknown) {
      res.status(401).send(`${(err as Error).message}`);
    }
  };

  router.post('/takeAction', takeActionRoute);

  return router;
};

export default actionsController;