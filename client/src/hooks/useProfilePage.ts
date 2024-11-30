import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import {
  Account,
  ProfilePagePayload,
  Answer,
  Question,
  User,
  Comment,
  DraftAnswer,
  DraftQuestion,
} from '../types';
import getProfileData from '../services/profileService';
import useUserContext from './useUserContext';

/**
 * Custom hook to manage the state and logic for a live search in the header.
 */
const useProfilePage = () => {
  const { user, socket } = useUserContext();
  const [userState, setUserState] = useState('');
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [userDraftAnswers, setUserDraftAnswers] = useState<DraftAnswer[]>([]);
  const [userDraftQuestions, setUserDraftQuestions] = useState<DraftQuestion[]>([]);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  const updateUser = async (profile: ProfilePagePayload) => {
    if (profile.username === user.username) {
      setUserQuestions(profile.questions);
      setScore(profile.score);
      setUserAnswers(profile.answers);
      setUserComments(profile.comments);
      setUserDraftAnswers(profile.answerDrafts);
      setUserDraftQuestions(profile.questionDrafts);
      console.log('PROFILE GOT:');
      console.log(profile);
    }
  };

  useEffect(() => {
    getProfileData(user);
  }, []);

  socket.on('userUpdate', updateUser);

  return {
    theme,
    navigate,
    userState,
    setUserState,
    user,
    score,
    userQuestions,
    userAnswers,
    userComments,
    userDraftAnswers,
    userDraftQuestions,
  };
};

export default useProfilePage;
