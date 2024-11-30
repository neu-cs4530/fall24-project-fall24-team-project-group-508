import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Button, List, ListItem, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getMetaData } from '../../../tool';
import { Comment } from '../../../types';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';
import ModeratorActionButtons, { ModeratorActionProps } from '../moderatorActions';

/**
 * Interface representing the props for the Comment Section component.
 *
 * - comments - list of the comment components
 * - handleAddComment - a function that handles adding a new comment, taking a Comment object as an argument
 * - moderatorInfo - information about the moderator
 */
interface CommentSectionProps {
  qid?: string;
  parentType: string;
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
  moderatorInfo: ModeratorActionProps;
}

/**
 * CommentSection component shows the users all the comments and allows the users add more comments.
 *
 * @param comments: an array of Comment objects
 * @param handleAddComment: function to handle the addition of a new comment
 * @param moderatorInfo: information about the moderator
 */
const CommentSection = ({
  qid,
  comments,
  parentType,
  handleAddComment,
  moderatorInfo,
}: CommentSectionProps) => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);

  /**
   * Function to handle the addition of a new comment.
   */
  const handleAddCommentClick = () => {
    if (text.trim() === '' || user.username.trim() === '') {
      setTextErr(text.trim() === '' ? 'Comment text cannot be empty' : '');
      return;
    }

    const newComment: Comment = {
      text,
      commentBy: user.username,
      commentDateTime: new Date(),
      pinned: false,
    };

    handleAddComment(newComment);
    setText('');
    setTextErr('');
  };

  /**
   * Dynamically assigns styles to comments based on their pinned status.
   */
  const assignStyle = (comment: Comment) => ({
    border: comment.pinned ? '2px solid blue' : '1px solid #ddd',
    backgroundColor: comment.pinned ? '#e3f2fd' : 'transparent',
    padding: 1,
    marginBottom: 1,
    borderRadius: '4px',
  });
  const navigate = useNavigate();

  return (
    <Box className='comment-section'>
      {/* Toggle button for showing/hiding comments */}
      <Button
        variant='contained'
        onClick={() => setShowComments(!showComments)}
        sx={{ marginBottom: 2 }}
        aria-expanded={showComments}
        aria-controls='comments-container'>
        <ExpandMoreIcon sx={{ transform: showComments ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </Button>

      {/* Comment section */}
      {showComments && (
        <Box
          id='comments-container'
          sx={{
            padding: 2,
            width: '100%',
          }}>
          <List>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <ListItem key={index} sx={assignStyle(comment)}>
                  <Box sx={{ flex: 1 }}>
                    {/* Moderator Actions */}
                    {(user?.userType === 'moderator' || user?.userType === 'owner') && ( // Only show if userType is 'moderator'
                      <Box sx={{ marginBottom: 1 }}>
                        {ModeratorActionButtons(moderatorInfo, comment._id)}
                      </Box>
                    )}
                    {/* Comment Text */}
                    <Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
                      {comment.text}
                    </Typography>
                    {/* Comment Meta Data */}
                    <Typography variant='caption' color='textSecondary'>
                      {comment.commentBy}, {getMetaData(new Date(comment.commentDateTime))}
                    </Typography>
                    {comment.commentBy === user.username ? (
                      <Button
                        sx={{ m: 1 }}
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          navigate(`/draft/${qid}/${parentType}/comment/${comment._id}`);
                        }}>
                        edit
                      </Button>
                    ) : (
                      <Box></Box>
                    )}
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography variant='body2' color='textSecondary'>
                No comments yet.
              </Typography>
            )}
          </List>

          {/* Add comment input */}
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant='outlined'
              label='Add a Comment'
              value={text}
              onChange={e => setText(e.target.value)}
              error={!!textErr}
              helperText={textErr}
              aria-describedby='comment-error-text'
            />
            <Button
              variant='contained'
              color='primary'
              onClick={handleAddCommentClick}
              sx={{ marginTop: 1 }}>
              Add Comment
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;
