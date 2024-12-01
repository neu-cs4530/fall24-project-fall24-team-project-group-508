import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CommentSection from '../../commentSection';
import './index.css';
import { Account, Comment } from '../../../../types';
import ModeratorActionButtons, { ModeratorActionProps } from '../../moderatorActions';
import MarkdownPreview from '../../markdownPreview';
import useUserContext from '../../../../hooks/useUserContext';
import { getAccountByName } from '../../../../services/accountService';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - locked Whether the answer is locked.
 * - pinned Whether the answer is pinned.
 * - isCorrect Whether the answer is marked as correct.
 * - qAskedBy The username of the user who asked the question.
 * - handleAddComment Callback function to handle adding a new comment.
 * - moderatorInfo Information about the moderator.
 * - onMarkCorrect Callback function to mark the answer as correct.
 */
interface AnswerProps {
  qid?: string;
  _id?: string;
  text: string;
  ansBy: string;
  meta: string;
  comments: Comment[];
  locked: boolean;
  pinned: boolean;
  cosmetic: boolean;
  isCorrect: boolean;
  qAskedBy: string;
  handleAddComment: (comment: Comment) => void;
  moderatorInfo: ModeratorActionProps;
  onMarkCorrect?: () => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param locked Whether the answer is locked.
 * @param pinned Whether the answer is pinned.
 * @param isCorrect Whether the answer is marked as correct.
 * @param qAskedBy The username of the user who asked the question.
 * @param handleAddComment Function to handle adding a new comment.
 * @param moderatorInfo Information about the moderator.
 * @param onMarkCorrect Callback function to mark the answer as correct.
 * @returns The AnswerView component.
 */
const AnswerView = ({
  qid,
  text,
  _id,
  ansBy,
  meta,
  comments,
  locked,
  pinned,
  cosmetic,
  isCorrect,
  qAskedBy,
  handleAddComment,
  moderatorInfo,
  onMarkCorrect,
}: AnswerProps) => {
  const dynamicStyles = {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px dashed #000',
    padding: 2,
    width: '100%',
    bgcolor: locked ? 'lightgray' : 'transparent',
    opacity: locked ? 0.7 : 1,
    borderColor: pinned ? 'green' : 'transparent',
    borderStyle: pinned ? 'solid' : 'none',
  };

  const pinSortedComments = comments.sort((a1, a2) => Number(a2.pinned) - Number(a1.pinned));
  const { user } = useUserContext();
  const [ansByAccount, setAnsByAccount] = useState<Account | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      const a = await getAccountByName(ansBy);
      setAnsByAccount(a);
    };

    fetchAccount();
  }, [ansBy]);
  const navigate = useNavigate();

  return (
    <Box sx={dynamicStyles}>
      {/* Moderator Actions */}
      <Box
        role='region'
        aria-label='Moderator actions'
        sx={{ marginBottom: 1, flexDirection: 'column' }}>
        {ModeratorActionButtons(moderatorInfo, moderatorInfo._id)}
      </Box>

      {/* Answer Text */}
      <Box id='answerText' sx={{ flex: 1 }}>
        <MarkdownPreview text={text} />
        {/* <Typography variant='body1' component='div' sx={{ wordBreak: 'break-word' }}>
          {handleHyperlink(text)}
        </Typography> */}
      </Box>

      {/* Author and Meta Information */}
      <Box sx={{ marginLeft: 2 }}>
        <Typography variant='subtitle2' component='div' sx={{ color: 'green', fontWeight: 'bold' }}>
          {ansBy}
        </Typography>
        {ansByAccount && ansByAccount.userType !== 'user' && (
          <Typography
            variant='subtitle2'
            component='div'
            sx={{ color: 'grey', fontWeight: 'bold' }}>
            Moderator
          </Typography>
        )}
        <Typography variant='caption' component='div'>
          {meta}
        </Typography>
        {!cosmetic && ansBy === user.username ? (
          <Button
            sx={{ m: 1 }}
            variant='contained'
            color='primary'
            onClick={() => {
              navigate(`/draft/${qid}/question/answer/${_id}`);
            }}>
            edit
          </Button>
        ) : (
          <Box></Box>
        )}
      </Box>

      {/* Comment Section */}
      {!cosmetic ? (
        <Box sx={{ width: 350 }}>
          <CommentSection
            qid={qid}
            comments={pinSortedComments}
            parentType='answer'
            handleAddComment={handleAddComment}
            moderatorInfo={{
              parentType: 'answer',
              parentID: moderatorInfo._id,
              _id: undefined,
              type: 'comment',
            }}
          />
        </Box>
      ) : (
        <div></div>
      )}
    </Box>
  );
};

export default AnswerView;
