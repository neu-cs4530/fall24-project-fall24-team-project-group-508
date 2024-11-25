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
import useUserContext from '../../../hooks/useUserContext';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const { questionID, question, handleNewComment, handleNewAnswer, handleAnswerCorrect } =
    useAnswerPage();
  const theme = useTheme();
  const { user } = useUserContext();

  if (!question) {
    return null;
  }

  // Sort answers by pinned status and correct status
  const sortedAnswers = question.answers.sort((a1, a2) => {
    // First sort by pinned status
    const pinnedDiff = Number(a2.pinned) - Number(a1.pinned);
    if (pinnedDiff !== 0) return pinnedDiff;
    // Then sort by correct status
    return Number(a2.isCorrect) - Number(a1.isCorrect);
  });

  const pinSortedComments = question.comments.sort(
    (a1, a2) => Number(a2.pinned) - Number(a1.pinned),
  );

  return (
    <div
      className='answer-page'
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
        {(user?.userType === 'moderator' || user?.userType === 'owner') && ( // Only show if userType is 'moderator'
          <Box sx={{ mb: 3 }}>
            {ModeratorActionButtons(
              {
                _id: question._id,
                type: 'question',
              },
              question._id,
            )}
          </Box>
        )}

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
          comments={pinSortedComments}
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
        {sortedAnswers.map((a, idx) => (
          <Paper key={idx} elevation={3} sx={{ mb: 2, p: 2 }}>
            <AnswerView
              text={a.text}
              ansBy={a.ansBy}
              meta={getMetaData(new Date(a.ansDateTime))}
              comments={a.comments}
              locked={a.locked}
              pinned={a.pinned}
              isCorrect={a.isCorrect}
              handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
              moderatorInfo={{
                parentType: 'question',
                parentID: questionID,
                _id: a._id,
                type: 'answer',
              }}
              onMarkCorrect={
                user?.username === question.askedBy ? () => handleAnswerCorrect(a) : undefined
              }
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
