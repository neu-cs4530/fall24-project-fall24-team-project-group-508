import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateHyperlink } from '../tool';
import {
  addAnswer,
  postAnswerFromDraft,
  saveAnswerFromDraft,
  saveDraftAnswer,
  updateAnswer,
} from '../services/answerService';
import useUserContext from './useUserContext';
import { Answer, DraftAnswer } from '../types';

/**
 * Custom hook for managing the state and logic of an answer submission form.
 *
 * @returns text - the current text input for the answer.
 * @returns textErr - the error message related to the text input.
 * @returns setText - the function to update the answer text input.
 * @returns postAnswer - the function to submit the answer after validation.
 */
const useAnswerForm = () => {
  const { qid } = useParams();
  const navigate = useNavigate();

  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [questionID, setQuestionID] = useState<string>('');

  useEffect(() => {
    if (!qid) {
      setTextErr('Question ID is missing.');
      navigate('/home');
      return;
    }

    setQuestionID(qid);
  }, [qid, navigate]);

  /**
   * Function to post an answer to a question.
   * It validates the answer text and posts the answer if it is valid.
   */
  const postAnswer = async () => {
    let isValid = true;

    if (!text) {
      setTextErr('Answer text cannot be empty');
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr('Invalid hyperlink format.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const answer: Answer = {
      text,
      ansBy: user.username,
      ansDateTime: new Date(),
      comments: [],
      pinned: false,
      locked: false,
      isCorrect: false,
    };

    const res = await addAnswer(questionID, answer);

    if (res && res._id) {
      // navigate to the question that was answered
      navigate(`/question/${questionID}`);
    }
  };

  const postDraft = async (answer: Answer, questionId: string) => {
    if (!answer) {
      setTextErr('Invalid answer being edited');
      return;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr('Invalid hyperlink format.');
      return;
    }

    const newAnswer = {
      ...answer,
      text,
    };

    const res = await updateAnswer(questionId, newAnswer);
    if (res) {
      navigate(`/question/${qid}`);
    }
  };

  const saveDraft = async (a?: Answer) => {
    // Hyperlink validation, text can be empty :)
    if (text && !validateHyperlink(text)) {
      setTextErr('Invalid hyperlink format.');
      return;
    }

    let answer: Answer;
    if (a) {
      answer = {
        ...a,
        text,
      };
    } else {
      answer = {
        text,
        isCorrect: false,
        ansBy: user.username,
        ansDateTime: new Date(),
        comments: [],
        pinned: false,
        locked: false,
      };
    }

    const res = await saveDraftAnswer(questionID, answer, user.username);

    if (res && res._id) {
      // navigate to the home page since question was saved
      navigate('/home');
    } else {
      setTextErr('answer failed to be saved');
    }
  };

  const postFromDraft = async (draftAnswer: DraftAnswer) => {
    if (!draftAnswer) return;
    if (!text) return;

    const newAnswer = {
      ...draftAnswer.editId,
      text,
    };

    draftAnswer.editId = newAnswer;

    const res = await postAnswerFromDraft(draftAnswer, draftAnswer.username);
    if (res) {
      navigate('/home');
    }
  };

  const saveFromDraft = async (draftAnswer: DraftAnswer) => {
    if (!draftAnswer) return;
    const newAnswer = {
      ...draftAnswer.editId,
      text,
    };

    draftAnswer.editId = newAnswer;

    const res = await saveAnswerFromDraft(draftAnswer, draftAnswer.username);
    if (res) {
      navigate('/home');
    }
  };

  return {
    text,
    textErr,
    setText,
    postAnswer,
    postDraft,
    saveDraft,
    postFromDraft,
    saveFromDraft,
  };
};

export default useAnswerForm;
