import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import './index.css';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();

  return (
    <Box role='main' sx={{ padding: 2 }}>
      <QuestionHeader
        titleText={titleText}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
      />

      <Box id='question_list' role='list' sx={{ marginTop: 2 }}>
        {qlist.length === 0 && titleText === 'Search Results' ? (
          <Typography variant='h6' sx={{ fontWeight: 'bold', paddingLeft: 2 }}>
            No Questions Found
          </Typography>
        ) : (
          qlist.map((q, idx) => (
            <Box key={idx} sx={{ marginBottom: 2 }}>
              <QuestionView q={q} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default QuestionPage;
