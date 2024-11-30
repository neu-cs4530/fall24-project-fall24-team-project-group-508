import './index.css';
import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import 'katex/dist/katex.min.css';
import MarkdownPreview from '../../markdownPreview';
import useAnswerForm from '../../../../hooks/useAnswerForm';
import useDraftPage from '../../../../hooks/useDraftPage';

export interface DraftAnswerProps {
  qid: string;
  id: string;
  type: string;
}

/**
 * DraftAnswerPage component allows users to submit an answerdraft or edit to a specific question.
 */
const DraftEditAnswerPage = (answerProps: DraftAnswerProps) => {
  const { qid, id, type } = answerProps;
  const { text, textErr, setText, postFromDraft, saveFromDraft } = useAnswerForm();
  const data = useDraftPage(type, id, undefined, setText);

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
      {/* Answer Input Field */}
      <TextField
        id='answerTextInput'
        label='Answer Text'
        multiline
        minRows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        error={Boolean(textErr)}
        helperText={textErr || ''}
        fullWidth
        aria-describedby='answer-text-helper'
        required
      />
      <h4>Answer Preview with Markdown and LaTeX Support:</h4>
      <div className='markdown_preview_container'>{/* <MarkdownPreview text={text} /> */}</div>

      {/* Buttons and Mandatory Field Indicator */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 1,
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 1,
          }}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              if (data.draftAnswer) {
                postFromDraft(data.draftAnswer);
              }
            }}
            aria-label='Post your answer'>
            Post Draft/Edit
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              if (data.draftAnswer) {
                saveFromDraft(data.draftAnswer);
              }
            }}
            aria-label='Save your answer'>
            Save Answer
          </Button>
        </Box>
        <Typography variant='caption' color='textSecondary'>
          * indicates mandatory fields for posting
        </Typography>
      </Box>
    </Box>
  );
};

export default DraftEditAnswerPage;
