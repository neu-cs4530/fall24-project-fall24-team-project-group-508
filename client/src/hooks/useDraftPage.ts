import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Account, ProfilePagePayload, Answer, Question, User, Comment, PresetTagName } from '../types';
import getProfileData from '../services/profileService';
import useUserContext from './useUserContext';
import { getQuestionById } from '../services/questionService';

/**
 * Custom hook to manage the state and logic for a live search in the header.
 */
const useDraftPage = (type: string, id: string, setTitle: (title: string)=>void, setText: (text: string)=>void, setTag: (tag: string)=>void, setPresetTags: (tags: PresetTagName[]) => void) => {
  
  const [question, setQuestion] = useState<Question>()
  const user = useUserContext();

  const loadDraftItem = async () => {
    if(type === 'question') {
        const q = await getQuestionById(id,user.user.username);
        setQuestion(q);
        setTitle(q.title);
        setText(q.text);
        const tagsStr = q.tags.map(tag => tag.name).join(' ');
        setTag(tagsStr)
        setPresetTags(q.presetTags);
    } else if(type === 'answer') {

    } else if(type === 'comment') {

    }
  }

  useEffect(() => {
    loadDraftItem();
  }, []);

  return {question};
};

export default useDraftPage;
