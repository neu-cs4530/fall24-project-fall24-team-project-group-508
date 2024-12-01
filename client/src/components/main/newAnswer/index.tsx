import './index.css';
import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import 'katex/dist/katex.min.css';
import useAnswerForm from '../../../hooks/useAnswerForm';
import MarkdownPreview from '../markdownPreview';

/**
 * NewAnswerPage component allows users to submit an answer to a specific question.
 */
const NewAnswerPage = () => {
  const { text, textErr, setText, postAnswer, saveDraft } = useAnswerForm();
  const handlePostAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    postAnswer();
  };
  const handleSaveAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    saveDraft();
  };

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
      <div className='markdown_preview_container'>
        <MarkdownPreview text={text} />
      </div>

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
            onClick={handlePostAnswer}
            aria-label='Post your answer'>
            Post Answer
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSaveAnswer}
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

export default NewAnswerPage;
