import React from 'react';
import './index.css';
import { Box, Typography } from '@mui/material';
import AskQuestionButton from '../../askQuestionButton';

/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - ansCount - The number of answers to display in the header.
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  ansCount: number;
  title: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param ansCount The number of answers to display.
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader = ({ ansCount, title }: AnswerHeaderProps) => (
  <Box
    id='answersHeader'
    sx={{
      display: 'flex',
      padding: '0 16px',
      marginBottom: '16px',
      borderBottom: '2px solid #e0e0e0',
      pb: 1,
    }}>
    <Typography
      variant='h6'
      component='div'
      sx={{
        fontWeight: 600,
        color: 'text.primary',
        whiteSpace: 'nowrap',
      }}>
      {ansCount} answers
    </Typography>

    <Typography
      variant='h6'
      component='div'
      sx={{
        fontWeight: 600,
        color: 'text.primary',
        textAlign: 'center',
        flexGrow: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
      {title}
    </Typography>

    <AskQuestionButton />
  </Box>
);

export default AnswerHeader;
