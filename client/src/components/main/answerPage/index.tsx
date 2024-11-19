import React from 'react';
import { Box, Button, Divider, Paper, useTheme } from '@mui/material';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types';
import './index.css';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';
import ModeratorActionButtons from '../moderatorActions';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const { questionID, question, handleNewComment, handleNewAnswer } = useAnswerPage();
  const theme = useTheme();

  if (!question) {
    return null;
  }

  const pinSortedAnswers = question.answers.sort((a1, a2) => Number(a2.pinned) - Number(a1.pinned));

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}>
      <Box
        sx={{
          p: 3,
        }}>
        {/* Voting Component */}
        <VoteComponent question={question} />

        {/* Answer Header */}
        <Box sx={{ mb: 2 }}>
          <AnswerHeader ansCount={question.answers.length} title={question.title} />
        </Box>

        {/* Moderator Actions */}
        <Box sx={{ mb: 3 }}>
          <ModeratorActionButtons type='question' _id={question._id} />
        </Box>

        {/* Question Body */}
        <QuestionBody
          views={question.views.length}
          text={question.text}
          askby={question.askedBy}
          meta={getMetaData(new Date(question.askDateTime))}
          pinned={question.pinned}
          locked={question.locked}
          tags={question.tags}
          presetTags={question.presetTags}
        />

        {/* Comments Section */}
        <CommentSection
          comments={question.comments}
          handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
          moderatorInfo={{
            parentType: 'question',
            parentID: questionID,
            _id: undefined,
            type: 'comment',
          }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Answer List */}
        {pinSortedAnswers.map((a, idx) => (
          <Paper key={idx} elevation={3} sx={{ mb: 2, p: 2 }}>
            <AnswerView
              text={a.text}
              ansBy={a.ansBy}
              meta={getMetaData(new Date(a.ansDateTime))}
              comments={a.comments}
              locked={a.locked}
              pinned={a.pinned}
              handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
              moderatorInfo={{
                parentType: 'question',
                parentID: questionID,
                _id: a._id,
                type: 'answer',
              }}
            />
          </Paper>
        ))}

        {/* Answer Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              handleNewAnswer();
            }}>
            Answer Question
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default AnswerPage;
