import './index.css';
import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
// eslint-disable-next-line import/no-extraneous-dependencies
import rehypeKatex from 'rehype-katex';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'katex/dist/katex.min.css';
import useAnswerForm from '../../../hooks/useAnswerForm';

/**
 * NewAnswerPage component allows users to submit an answer to a specific question.
 */
const NewAnswerPage = () => {
  const { text, textErr, setText, postAnswer } = useAnswerForm();
  const handlePostAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    postAnswer();
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
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {text}
        </ReactMarkdown>
      </div>

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
          onClick={handlePostAnswer}
          aria-label='Post your answer'>
          Post Answer
        </Button>
        <Typography variant='caption' color='textSecondary'>
          * indicates mandatory fields
        </Typography>
      </Box>
    </Box>
  );
};

export default NewAnswerPage;
