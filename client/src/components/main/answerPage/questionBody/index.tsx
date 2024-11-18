import React from 'react';
import './index.css';
import { Box, Chip, Typography, useTheme } from '@mui/material';
import { handleHyperlink } from '../../../../tool';
import { PresetTagName } from '../../../../types';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  meta: string;
  pinned: boolean;
  locked: boolean;
  presetTags?: PresetTagName[];
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param views The number of views the question has received.
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody = ({
  views,
  text,
  askby,
  meta,
  pinned,
  locked,
  presetTags,
}: QuestionBodyProps) => {
  let questionClassName = 'questionBody right_padding';
  if (pinned) {
    questionClassName += ' pinned';
  }
  if (locked) {
    questionClassName += ' locked';
  }
  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}>
      <Box
        id='questionBody'
        sx={{
          p: 2,
          border: '1px solid #ccc',
          borderRadius: '4px',
          mb: 2,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderColor: pinned ? 'blue' : 'transparent',
        }}
        className={questionClassName}
        role='region'
        aria-labelledby='question-title'>
        <Typography
          id='question-title'
          variant='h6'
          component='h2'
          sx={{ fontWeight: 'bold', mb: 1 }}>
          {views} views
        </Typography>
        <Typography className='answer_question_text' variant='body1' component='div' sx={{ mb: 2 }}>
          {handleHyperlink(text)}
        </Typography>
        <Box
          className='answer_question_tags'
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {presetTags?.map((tag, idx) => (
            <Chip
              key={idx}
              label={tag}
              className='tag'
              sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
              role='listitem'
              aria-label={`Tag: ${tag}`}
            />
          ))}
        </Box>
        <Box
          className='answer_question_right'
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}>
          <Typography
            className='question_author'
            variant='body2'
            component='p'
            aria-label={`Asked by ${askby}`}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}>
            {askby}
          </Typography>
          <Typography
            className='answer_question_meta'
            variant='caption'
            component='p'
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
            aria-label={`Asked ${meta}`}>
            asked {meta}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default QuestionBody;
