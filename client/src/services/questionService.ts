import { DraftQuestion, Question } from '../types';
import api from './config';

const QUESTION_API_URL = `${process.env.REACT_APP_SERVER_URL}/question`;

/**
 * Function to get questions by filter.
 *
 * @param order - The order in which to fetch questions. Default is 'newest'.
 * @param search - The search term to filter questions. Default is an empty string.
 * @throws Error if there is an issue fetching or filtering questions.
 */
const getQuestionsByFilter = async (
  order: string = 'newest',
  search: string = '',
): Promise<Question[]> => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering questions');
  }
  return res.data;
};

/**
 * Function to get a question by its ID.
 *
 * @param qid - The ID of the question to retrieve.
 * @param username - The username of the user requesting the question.
 * @throws Error if there is an issue fetching the question by ID.
 */
const getQuestionById = async (qid: string, username: string): Promise<Question> => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching question by id');
  }
  return res.data;
};

/**
 * Function to get a question by its ID.
 *
 * @param qid - The ID of the question to retrieve.
 * @param username - The username of the user requesting the question.
 * @throws Error if there is an issue fetching the question by ID.
 */
const getDraftQuestionById = async (qid: string, username: string): Promise<DraftQuestion> => {
  const res = await api.get(`${QUESTION_API_URL}/getDraftQuestionById/${qid}?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching question by id');
  }
  return res.data;
};

/**
 * Function to add a new question.
 *
 * @param q - The question object to add.
 * @throws Error if there is an issue creating the new question.
 */
const addQuestion = async (q: Question): Promise<Question> => {
  const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

  if (res.status !== 200) {
    throw new Error('Error while creating a new question');
  }

  return res.data;
};

const updateQuestion = async (q: Question): Promise<Question> => {
  const res = await api.post(`${QUESTION_API_URL}/updateQuestion`, q);

  if (res.status !== 200) {
    throw new Error('Error while creating a new question');
  }

  return res.data;
};

/**
 * Function to upvote a question.
 *
 * @param qid - The ID of the question to upvote.
 * @param username - The username of the person upvoting the question.
 * @throws Error if there is an issue upvoting the question.
 */
const upvoteQuestion = async (qid: string, username: string) => {
  const data = { qid, username };
  const res = await api.post(`${QUESTION_API_URL}/upvoteQuestion`, data);
  if (res.status !== 200) {
    throw new Error('Error while upvoting the question');
  }
  return res.data;
};

/**
 * Function to downvote a question.
 *
 * @param qid - The ID of the question to downvote.
 * @param username - The username of the person downvoting the question.
 * @throws Error if there is an issue downvoting the question.
 */
const downvoteQuestion = async (qid: string, username: string) => {
  const data = { qid, username };
  const res = await api.post(`${QUESTION_API_URL}/downvoteQuestion`, data);
  if (res.status !== 200) {
    throw new Error('Error while downvoting the question');
  }
  return res.data;
};

const saveDraftQuestion = async (question: Question, username: string): Promise<Question> => {
  const data = { draft: question, username };
  const res = await api.post(`${QUESTION_API_URL}/saveDraft`, data);

  if (res.status !== 200) {
    throw new Error('Error while saving a new question draft');
  }

  return res.data;
};

const saveQuestionFromDraft = async (draft: DraftQuestion, username: string): Promise<Question> => {
  const data = { draftQuestion: draft.editId, username, realId: draft.realId };
  const res = await api.post(`${QUESTION_API_URL}/saveFromDraft`, data);

  if (res.status !== 200) {
    throw new Error('Error while saving a new question draft');
  }

  return res.data;
};

const postQuestionFromDraft = async (
  draftQuestion: DraftQuestion,
  username: string,
): Promise<Question> => {
  const data = {
    draftQuestion: draftQuestion.editId,
    username,
    realId: draftQuestion.realId,
  };
  const res = await api.post(`${QUESTION_API_URL}/postFromDraft`, data);

  if (res.status !== 200) {
    throw new Error('Error while saving a new question draft');
  }

  return res.data;
};

export {
  getQuestionsByFilter,
  getQuestionById,
  addQuestion,
  upvoteQuestion,
  downvoteQuestion,
  updateQuestion,
  saveDraftQuestion,
  getDraftQuestionById,
  postQuestionFromDraft,
  saveQuestionFromDraft,
};
