import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { Box, Chip, Typography } from '@mui/material';
import { getMetaData } from '../../../../tool';
import { Question } from '../../../../types';

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface QuestionProps {
  q: Question;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param q - The question object containing question details.
 */
const QuestionView = ({ q }: QuestionProps) => {
  const navigate = useNavigate();

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <Box
      role='article'
      sx={{
        'padding': 2,
        'marginBottom': 2,
        'cursor': 'pointer',
        'border': '1px solid #ccc',
        'borderRadius': 1,
        '&:hover': {
          backgroundColor: '#f4f4f4',
        },
      }}
      onClick={() => {
        if (q._id) {
          handleAnswer(q._id);
        }
      }}>
      {/* Post Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
        <Typography variant='body2'>{q.answers.length || 0} answers</Typography>
        <Typography variant='body2'>{q.views.length} views</Typography>
      </Box>

      {/* Question Title and Tags */}
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          {q.title}
        </Typography>

        {/* Question Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 1 }}>
          {q.tags.map((tag, idx) => (
            <Chip
              key={idx}
              label={tag.name}
              onClick={e => {
                e.stopPropagation();
                clickTag(tag.name);
              }}
              sx={{ marginRight: 1, marginBottom: 1, cursor: 'pointer' }}
              variant='outlined'
              color='primary'
              size='small'
            />
          ))}
        </Box>

        {/* Preset Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 1 }}>
          {q.presetTags.map((tag, idx) => (
            <Chip
              key={idx}
              label={tag}
              onClick={e => {
                e.stopPropagation();
                clickTag(tag); // assuming presetTags is just a string array
              }}
              sx={{ marginRight: 1, marginBottom: 1, cursor: 'pointer' }}
              variant='outlined'
              color='secondary'
              size='small'
            />
          ))}
        </Box>
      </Box>

      {/* Last Activity */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='body2' color='textSecondary'>
          {q.askedBy}
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          asked {getMetaData(new Date(q.askDateTime))}
        </Typography>
      </Box>
    </Box>
  );
};

export default QuestionView;
