import './index.css';
import { Box, Button, Divider, Paper, useTheme } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Label } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import useProfilePage from '../../../hooks/useProfilePage';
import { Answer, Comment, Question } from '../../../types';
import DraftQuestionPage from './DraftQuestion';
import DraftAnswerPage from './DraftAnswer';
import DraftCommentPage from './DraftComment';
import DraftEditAnswerPage from './DraftEditAnswer';
import DraftEditQuestionPage from './DraftEditQuestion';

const DraftPage = () => {
  const { qid, type, id, parentType } = useParams();
  const { score, user } = useProfilePage();
  const theme = useTheme();

  if (type === 'question') {
    return <DraftQuestionPage type={'question'} id={id || 'undefined'}></DraftQuestionPage>;
  }
  if (type === 'answer') {
    return (
      <DraftAnswerPage
        qid={qid || 'undefined'}
        type={'answer'}
        id={id || 'undefined'}></DraftAnswerPage>
    );
  }
  if (type === 'comment') {
    return (
      <DraftCommentPage
        qid={qid || 'undefined'}
        type={'comment'}
        id={id || 'undefined'}
        parentType={parentType || 'undefined'}></DraftCommentPage>
    );
  }
  if (type === 'draftQuestion') {
    return (
      <DraftEditQuestionPage type={'draftQuestion'} id={id || 'undefined'}></DraftEditQuestionPage>
    );
  }
  if (type === 'draftAnswer') {
    return (
      <DraftEditAnswerPage
        qid={qid || 'undefined'}
        type={'draftAnswer'}
        id={id || 'undefined'}></DraftEditAnswerPage>
    );
  }
};

export default DraftPage;
