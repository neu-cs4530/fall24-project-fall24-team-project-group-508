import './index.css';
import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import useDraftPage from '../../../../hooks/useDraftPage';
import useCommentForm from '../../../../hooks/useCommentForm';

export interface DraftCommentProps {
  qid: string;
  id: string;
  type: string;
  parentType: string;
}

/**
 * DraftCommentPage component allows users to submit an commentdraft or edit to a specific question.
 */
const DraftCommentPage = (commentProps: DraftCommentProps) => {
  const { qid, id, type, parentType } = commentProps;
  const { text, textErr, setText, postDraft } = useCommentForm();

  const comment = useDraftPage(type, id, undefined, setText);

  return (
    <Box
      component='form'
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 600,
        margin: '0 auto',
        p: 2,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 1,
      }}>
      {/* Comment Input Field */}
      <TextField
        id='commentTextInput'
        label='Comment Text'
        multiline
        minRows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        error={Boolean(textErr)}
        helperText={textErr || ''}
        fullWidth
        aria-describedby='comment-text-helper'
        required
      />

      {/* Buttons and Mandatory Field Indicator */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 1,
        }}>
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            if (comment.comment) {
              postDraft(comment.comment, qid, parentType);
            }
          }}
          aria-label='Post your comment'>
          Post Edit
        </Button>
        <Typography variant='caption' color='textSecondary'>
          * indicates mandatory fields
        </Typography>
      </Box>
    </Box>
  );
};

export default DraftCommentPage;
