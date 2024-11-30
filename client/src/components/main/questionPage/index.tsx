import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import './index.css';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';
import { PresetTagName } from '../../../types';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();
  const [displayedQuestions, setDisplayedQuestions] = useState(qlist); // Separate state for filtered list.

  const theme = useTheme();

  const setFilterTag = (tag: string) => {
    if (!tag) {
      // If no tag is selected, reset to full list.
      setDisplayedQuestions(qlist);
    } else {
      // Filter based on the selected tag.
      const filtered = qlist.filter(q => q.presetTags.includes(tag as PresetTagName));
      setDisplayedQuestions(filtered);
    }
  };

  React.useEffect(() => {
    // Update displayedQuestions whenever qlist changes (e.g., on search or order change).
    setDisplayedQuestions(qlist);
  }, [qlist]);

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}>
      <Box role='main' sx={{ padding: 2 }}>
        <QuestionHeader
          titleText={titleText}
          qcnt={displayedQuestions.length}
          setQuestionOrder={setQuestionOrder}
          setFilterTag={setFilterTag}
        />

        <Box id='question_list' role='list' sx={{ marginTop: 2 }}>
          {displayedQuestions.length === 0 && titleText === 'Search Results' ? (
            <Typography variant='h6' sx={{ fontWeight: 'bold', paddingLeft: 2 }}>
              No Questions Found
            </Typography>
          ) : (
            displayedQuestions.map((q, idx) => (
              <Box
                key={idx}
                sx={{
                  marginBottom: 1,
                  padding: 1,
                  borderRadius: 1,
                  backgroundColor: theme.palette.background.default,
                }}>
                <QuestionView q={q} />
              </Box>
            ))
          )}
        </Box>
      </Box>
    </div>
  );
};

export default QuestionPage;
