import './index.css';
import { Box, Button, Divider, Paper, useTheme } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Label } from '@mui/icons-material';
import useProfilePage from '../../../hooks/useProfilePage';
import { Answer, Comment, Question } from '../../../types';
import { useParams } from 'react-router-dom';
import DraftQuestionPage from './DraftQuestion';




const DraftPage = () => {
  const { type, id } = useParams();
  const { score, user } = useProfilePage();
  const theme = useTheme();

  if(type === 'question') {
    return (
        <DraftQuestionPage type={'question'} id={id?id:'undefined'}>
        </DraftQuestionPage>
    )
  } else if(type === 'answer') {

  } else if(type === 'comment') {

  }

};

export default DraftPage;
