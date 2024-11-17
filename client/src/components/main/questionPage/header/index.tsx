import React from 'react';
import './index.css';
import { Box, Button, Stack, Typography } from '@mui/material';
import OrderButton from './orderButton';
import { OrderType, orderTypeDisplayName } from '../../../../types';
import AskQuestionButton from '../../askQuestionButton';

/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader = ({ titleText, qcnt, setQuestionOrder }: QuestionHeaderProps) => (
  <Box>
    <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
      <Typography variant='h5' component='h1' sx={{ fontWeight: 'bold' }} aria-live='polite'>
        {titleText}
      </Typography>
      <AskQuestionButton />
    </Stack>

    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Typography id='question_count' variant='body1' aria-live='polite'>
        {qcnt} questions
      </Typography>

      <Box role='group' aria-labelledby='order-buttons' sx={{ display: 'flex', gap: 1 }}>
        {Object.keys(orderTypeDisplayName).map((order, idx) => (
          <OrderButton
            key={idx}
            orderType={order as OrderType}
            setQuestionOrder={setQuestionOrder}
          />
        ))}
      </Box>
    </Stack>
  </Box>
);

export default QuestionHeader;
