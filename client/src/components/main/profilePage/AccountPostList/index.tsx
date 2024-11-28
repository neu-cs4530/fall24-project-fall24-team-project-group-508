import './index.css';
import { Box, Button, Divider, List, ListItem, Paper, Typography, useTheme } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Label } from '@mui/icons-material';
import { Key, useState } from 'react';
import QuestionView from '../../questionPage/question';
import { Account, Answer, Question, Comment } from '../../../../types';
import AnswerView from '../../answerPage/answer';
import useProfilePage from '../../../../hooks/useProfilePage';
import { getMetaData } from '../../../../tool';
import CommentSection from '../../commentSection';

/**
 * ProfilePage component that displays the full content of a profile, with that user's q/a/c's
 */
const ProfilePage = () => {
    //{theme, userState, setUserState, userQuestions, userAnswers, userComments};
  const { theme, navigate, userState, setUserState, userQuestions, userAnswers, userComments} = useProfilePage();

  
  const listToShow = () => {
    if (userState === 'questions') {
      return userQuestions;
    }
    if (userState === 'answers') {
      return userAnswers;
    }
    if (userState === 'comments') {
      return userComments;
    }
    if (userState === 'drafts') {
      // return account.drafts
    }

    return [];
  };

  const getReactType = (item: any) => {
    if (userState === '') {
      return <div></div>;
    }
    if (userState === 'questions') {
      return <QuestionView q={item as Question}></QuestionView>;
    }
    if (userState === 'answers') {
      const ans = item as Answer;
      return (
        <Box>
        <AnswerView 
          
          text={ans.text}
          _id={ans._id}
          ansBy={ans.ansBy}
          meta={getMetaData(new Date(ans.ansDateTime))}
          comments={[]}
          locked={ans.locked}
          pinned={ans.pinned}
          cosmetic={true}
          handleAddComment={() => {}}
          moderatorInfo={{
            type: 'answer',
          }}></AnswerView></Box>
      );
    }
    if (userState === 'comments') {
      return displayComment(item);
    } /* else if(userState === 'drafts' ) {
        return (<QuestionView q={item as Question}></QuestionView>);
    } */
  };

  return (
    <div>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          sx={{ m: 1 }}
          variant='contained'
          color='primary'
          onClick={() => {
            setUserState('questions');
          }}>
          my questions
        </Button>
        <Button
          sx={{ m: 1 }}
          variant='contained'
          color='primary'
          onClick={() => {
            setUserState('answers');
          }}>
          my answers
        </Button>
        <Button
          sx={{ m: 1 }}
          variant='contained'
          color='primary'
          onClick={() => {
            setUserState('comments');
          }}>
          my comments
        </Button>
        <Button
          sx={{ m: 1 }}
          variant='contained'
          color='primary'
          onClick={() => {
            setUserState('drafts');
          }}>
          my drafts
        </Button>
      </Box>
      {listToShow().map((item, idx: Key) => (
        <Box
          key={idx}
          sx={{
            marginBottom: 1,
            padding: 1,
            borderRadius: 1,
            backgroundColor: theme.palette.background.default,
          }}>
          {getReactType(item)}
        </Box>
      ))}
    </div>
  );
};

const displayComment = (comment: Comment) => {
  const assignStyle = (comment: Comment) => ({
    border: comment.pinned ? '2px solid blue' : '1px solid #ddd',
    backgroundColor: comment.pinned ? '#e3f2fd' : 'transparent',
    padding: 1,
    marginBottom: 1,
    borderRadius: '4px',
  });

  return (
    <Box sx={{ flex: 1 }}>
        {/* Comment Text */}
        <Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
        {comment.text}
        </Typography>
        {/* Comment Meta Data */}
        <Typography variant='caption' color='textSecondary'>
        {comment.commentBy}, {getMetaData(new Date(comment.commentDateTime))}
        </Typography>
    </Box>     
  );
};

export default ProfilePage;
