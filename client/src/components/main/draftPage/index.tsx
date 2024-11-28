import './index.css';
import { Box, Button, Divider, Paper, useTheme } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Label } from '@mui/icons-material';
import useProfilePage from '../../../hooks/useProfilePage';
import { Answer, Comment, Question } from '../../../types';
import { useParams } from 'react-router-dom';
import DraftQuestionPage from './DraftQuestion';
import DraftAnswerPage from './DraftAnswer';
import DraftCommentPage from './DraftComment';




const DraftPage = () => {
  const { qid, type, id, parentType } = useParams();
  const { score, user } = useProfilePage();
  const theme = useTheme();

  if(type === 'question') {
    return (
        <DraftQuestionPage type={'question'} id={id?id:'undefined'}>
        </DraftQuestionPage>
    )
  } else if(type === 'answer') {
   return (
        <DraftAnswerPage qid={qid?qid:'undefined'} type={'answer'} id={id?id:'undefined'}>

        </DraftAnswerPage>
   )
  } else if(type === 'comment') {
    return (
      <DraftCommentPage qid={qid?qid:'undefined'} type={'comment'} id={id?id:'undefined'} parentType={parentType?parentType:'undefined'}>

      </DraftCommentPage>
 )
  }

};

export default DraftPage;
