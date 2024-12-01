import './index.css';
import { Box, Button, Typography } from '@mui/material';
import { Key } from 'react';
import QuestionView from '../../questionPage/question';
import { Answer, Question, Comment } from '../../../../types';
import AnswerView from '../../answerPage/answer';
import useProfilePage from '../../../../hooks/useProfilePage';
import { getMetaData } from '../../../../tool';

/**
 * ProfilePage component that displays the full content of a profile, with that user's q/a/c's
 */
const ProfilePage = () => {
  const {
    theme,
    navigate,
    userState,
    setUserState,
    userQuestions,
    userAnswers,
    userComments,
    userDraftAnswers,
    userDraftQuestions,
  } = useProfilePage();

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
    if (userState === 'draftAnswers') {
      return userDraftAnswers;
    }
    if (userState === 'draftQuestions') {
      return userDraftQuestions;
    }

    return [];
  };

  const displayComment = (comment: Comment) => (
    // const assignStyle = (c: Comment) => ({
    //   border: comment.pinned ? '2px solid blue' : '1px solid #ddd',
    //   backgroundColor: comment.pinned ? '#e3f2fd' : 'transparent',
    //   padding: 1,
    //   marginBottom: 1,
    //   borderRadius: '4px',
    // });

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            qAskedBy={ans.ansBy}
            isCorrect={ans.isCorrect}
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
            }}></AnswerView>
        </Box>
      );
    }
    if (userState === 'comments') {
      return displayComment(item);
    }
    if (userState === 'draftQuestions') {
      return (
        <Box
          onClick={() => {
            navigate(`/draft/${item._id}/draftQuestion/draftQuestion/${item._id}`);
          }}>
          <QuestionView q={item.editId as Question}></QuestionView>
        </Box>
      );
    }
    if (userState === 'draftAnswers') {
      const ans = item.editId as Answer;
      return (
        <Box
          onClick={() => {
            navigate(`/draft/${item.qid}/draftAnswer/draftAnswer/${item._id}`);
          }}>
          {
            <AnswerView
              text={ans.text}
              qAskedBy={ans.ansBy}
              isCorrect={ans.isCorrect}
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
              }}></AnswerView>
          }
        </Box>
      );
    }
    return <div></div>;
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
            setUserState('draftQuestions');
          }}>
          my question drafts
        </Button>
        <Button
          sx={{ m: 1 }}
          variant='contained'
          color='primary'
          onClick={() => {
            setUserState('draftAnswers');
          }}>
          my answer drafts
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

export default ProfilePage;
