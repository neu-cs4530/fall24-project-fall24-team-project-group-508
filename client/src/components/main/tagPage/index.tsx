import React from 'react';
import './index.css';
import { Box, Paper, Typography } from '@mui/material';
import TagView from './tag';
import useTagPage from '../../../hooks/useTagPage';
import AskQuestionButton from '../askQuestionButton';

/**
 * Represents the TagPage component which displays a list of tags
 * and provides functionality to handle tag clicks and ask a new question.
 */
const TagPage = () => {
  const { tlist, clickTag } = useTagPage();

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        paddingRight={2}
        marginBottom={2}
        marginTop={5}>
        <Typography variant='h6' fontWeight='bold'>
          {tlist.length} Tags
        </Typography>
        <Typography variant='h6' fontWeight='bold'>
          All Tags
        </Typography>
        <AskQuestionButton />
      </Box>

      <Box display='flex' flexWrap='wrap' gap={2} paddingRight={2}>
        {tlist.map((t, idx) => (
          <Paper
            key={idx}
            elevation={3}
            sx={{
              'display': 'flex',
              'flexDirection': 'column',
              'alignItems': 'center',
              'padding': '8px 16px',
              'borderRadius': 2,
              'border': '1px solid #ddd',
              'boxShadow': 3,
              '&:hover': {
                boxShadow: 6, // Darker shadow on hover for better interactivity
              },
            }}>
            <TagView t={t} clickTag={clickTag} />
          </Paper>
        ))}
      </Box>
    </>
  );
};

export default TagPage;
