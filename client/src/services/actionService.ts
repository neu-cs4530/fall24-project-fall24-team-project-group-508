import { Answer } from '../types';
import api from './config';

const ACTION_API_URL = `${process.env.REACT_APP_SERVER_URL}/action`;

/**
 * Interface extending the request body when taking an action on a question/answer/comment, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */

// user: Account;
// actionType: ActionTypes;
// postType: 'question' | 'answer' | 'comment';
// postID: string;

export interface TakeActionRequestBody {
  user: { username: string; hashedPassword: string; email: string };
  actionType: 'pin' | 'lock' | 'remove' | 'promote';
  postType: 'question' | 'answer' | 'comment';
  postID: string;
  parentID?: string;
  parentPostType?: 'question' | 'answer' | 'comment';
}

/**
 * Adds a new answer to a specific question.
 *
 * @param qid - The ID of the question to which the answer is being added.
 * @param ans - The answer object containing the answer details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const takeUserAction = async (actionInfo: TakeActionRequestBody): Promise<Answer> => {
  const res = await api.post(`${ACTION_API_URL}/takeAction`, actionInfo);
  if (res.status !== 200) {
    throw new Error('Error while taking action');
  }
  return res.data;
};

export default takeUserAction;
