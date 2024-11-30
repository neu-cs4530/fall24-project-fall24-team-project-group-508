import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import useTextToSpeech from '../../../hooks/useTTS';

const ReadPageButton: React.FC = () => {
  const { isSpeaking, handleStartReading, handleStopReading } = useTextToSpeech();

  const handleReadPage = () => {
    const pageContent = document.body.innerText;
    handleStartReading(pageContent);
  };

  return (
    <Box textAlign='center' mt={4}>
      <Typography variant='h5' gutterBottom>
        Text-to-Speech Webpage Reader
      </Typography>
      <Button
        variant='contained'
        color='primary'
        onClick={handleReadPage}
        disabled={isSpeaking} // Disable if speech is already in progress
        sx={{ marginRight: 2 }}>
        {isSpeaking ? 'Reading...' : 'Read Page'}
      </Button>
      <Button variant='outlined' color='secondary' onClick={handleStopReading}>
        Stop Reading
      </Button>
    </Box>
  );
};

export default ReadPageButton;
