import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Comment } from '../types';
import { updateComment } from '../services/commentService';

/**
 * Custom hook for managing the state and logic of an answer submission form.
 *
 * @returns text - the current text input for the answer.
 * @returns textErr - the error message related to the text input.
 * @returns setText - the function to update the answer text input.
 * @returns postAnswer - the function to submit the answer after validation.
 */
const useCommentForm = () => {
  const { qid } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [, setQuestionID] = useState<string>('');

  useEffect(() => {
    if (!qid) {
      setTextErr('Question ID is missing.');
      navigate('/home');
      return;
    }

    setQuestionID(qid);
  }, [qid, navigate]);

  const postDraft = async (comment: Comment, questionId: string, parentType: string) => {
    if (!comment || (parentType !== 'question' && parentType !== 'answer')) return;

    const newComment: Comment = {
      ...comment,
      text,
    };

    const res = await updateComment(questionId, parentType, newComment);
    if (res) {
      navigate(`/question/${qid}`);
    }
  };

  return {
    text,
    textErr,
    setText,
    postDraft,
  };
};

export default useCommentForm;
