import { Box, Button, Typography } from '@mui/material';
import { downvoteQuestion, upvoteQuestion } from '../../../services/questionService';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';
import { Question } from '../../../types';
import useVoteStatus from '../../../hooks/useVoteStatus';

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 */
interface VoteComponentProps {
  question: Question;
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param question - The question object containing voting information.
 */
const VoteComponent = ({ question }: VoteComponentProps) => {
  const { user } = useUserContext();
  const { count, voted } = useVoteStatus({ question });

  /**
   * Function to handle upvoting or downvoting a question.
   *
   * @param type - The type of vote, either 'upvote' or 'downvote'.
   */
  const handleVote = async (type: string) => {
    try {
      if (question._id) {
        if (type === 'upvote') {
          await upvoteQuestion(question._id, user.username);
        } else if (type === 'downvote') {
          await downvoteQuestion(question._id, user.username);
        }
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Box className='vote-container'>
      <Button
        variant='contained'
        color='primary'
        onClick={() => handleVote('upvote')}
        sx={{
          'backgroundColor': voted === 1 ? 'green' : 'gray',
          '&:hover': {
            backgroundColor: voted === 1 ? 'darkgreen' : 'gray',
          },
          'marginRight': 1,
        }}>
        Upvote
      </Button>
      <Button
        variant='contained'
        color='secondary'
        onClick={() => handleVote('downvote')}
        sx={{
          'backgroundColor': voted === -1 ? 'red' : 'gray',
          '&:hover': {
            backgroundColor: voted === -1 ? 'darkred' : 'gray',
          },
          'marginRight': 1,
        }}>
        Downvote
      </Button>
      <Typography variant='body1' className='vote-count'>
        {count}
      </Typography>
    </Box>
  );
};

export default VoteComponent;
