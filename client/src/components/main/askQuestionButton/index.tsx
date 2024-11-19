import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { Button } from '@mui/material';

/**
 * AskQuestionButton component that renders a button for navigating to the
 * "New Question" page. When clicked, it redirects the user to the page
 * where they can ask a new question.
 */
const AskQuestionButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Question" page.
   */
  const handleNewQuestion = () => {
    navigate('/new/question');
  };

  return (
    <Button
      variant='contained' // Material UI Button variant, can be 'text', 'outlined', or 'contained'
      color='primary' // Primary color of the button
      onClick={handleNewQuestion}
      style={{ margin: '10px' }} // Optional styling (can also use MUI's sx prop for styling)
    >
      Ask a Question
    </Button>
  );
};

export default AskQuestionButton;
