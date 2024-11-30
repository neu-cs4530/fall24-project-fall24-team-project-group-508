import { Answer, DraftAnswer } from '../types';
import api from './config';

const ANSWER_API_URL = `${process.env.REACT_APP_SERVER_URL}/answer`;

/**
 * Adds a new answer to a specific question.
 *
 * @param qid - The ID of the question to which the answer is being added.
 * @param ans - The answer object containing the answer details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addAnswer = async (qid: string, ans: Answer): Promise<Answer> => {
  const data = { qid, ans };

  const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new answer');
  }
  return res.data;
};

const getAnswerById = async (id: string, username: string): Promise<Answer> => {
  const res = await api.get(`${ANSWER_API_URL}/getAnswerById/${id}?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching answer by id');
  }
  return res.data;
};

const getDraftAnswerById = async (id: string, username: string): Promise<DraftAnswer> => {
  const res = await api.get(`${ANSWER_API_URL}/getDraftAnswerById/${id}?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching answer by id');
  }
  return res.data;
};

const updateAnswer = async (qid: string, ans: Answer): Promise<Answer> => {
  const data = { qid, ans };
  const res = await api.post(`${ANSWER_API_URL}/updateAnswer`, data);

  if (res.status !== 200) {
    throw new Error('Error while updating an answer');
  }

  return res.data;
};

const saveDraftAnswer = async (qid: string, ans: Answer, username: string): Promise<Answer> => {
  const data = { qid, draft: ans, username };
  const res = await api.post(`${ANSWER_API_URL}/saveDraft`, data);

  if (res.status !== 200) {
    throw new Error('Error while saving a new answer draft');
  }

  return res.data;
};

const saveAnswerFromDraft = async (draft: DraftAnswer, username: string): Promise<Answer> => {
  const data = {
    draftAnswer: draft.editId,
    username,
    realId: draft.realId,
    qid: draft.qid,
  };
  const res = await api.post(`${ANSWER_API_URL}/saveFromDraft`, data);

  if (res.status !== 200) {
    throw new Error('Error while saving a new answer draft');
  }

  return res.data;
};

const postAnswerFromDraft = async (draft: DraftAnswer, username: string): Promise<Answer> => {
  const data = {
    draftAnswer: draft.editId,
    username,
    realId: draft.realId,
    qid: draft.qid,
  };
  const res = await api.post(`${ANSWER_API_URL}/postFromDraft`, data);

  if (res.status !== 200) {
    throw new Error('Error while saving a new answer draft');
  }

  return res.data;
};

export {
  addAnswer,
  getAnswerById,
  updateAnswer,
  saveDraftAnswer,
  getDraftAnswerById,
  saveAnswerFromDraft,
  postAnswerFromDraft,
};
