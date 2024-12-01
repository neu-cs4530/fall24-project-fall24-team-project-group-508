import React from 'react';
import './index.css';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import OrderButton from './orderButton';
import { OrderType, orderTypeDisplayName } from '../../../../types';
import AskQuestionButton from '../../askQuestionButton';

/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 * setFilterTag - A function that sets the filter tag based on the selected tag.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
  setFilterTag: (tag: string) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 * @param setFilterTag - Function to set the filter tag based on the selected tag.
 */
const QuestionHeader = ({
  titleText,
  qcnt,
  setQuestionOrder,
  setFilterTag,
}: QuestionHeaderProps) => {
  const [selectedTag, setSelectedTag] = React.useState<string>('');

  const tags = [
    'C',
    'C++',
    'Java',
    'Python',
    'JavaScript',
    'HTML',
    'CSS',
    'SQL',
    'MongoDB',
    'React',
    'Angular',
    'Node.js',
    'OOD',
    'SWE',
    'Algorithms',
    'Data Structures',
    'Testing',
    'Debugging',
    'Version Control',
    'Security',
    'Web Development',
    'Mobile Development',
    'Cloud Computing',
    'DevOps',
    'Agile',
    'Scrum',
    'Kanban',
    'CI/CD',
    'Docker',
    'Kubernetes',
    'Microservices',
    'Serverless',
    'RESTful APIs',
    'GraphQL',
    'WebSockets',
    'OAuth',
    'JWT',
    'Cookies',
    'Sessions',
    'SQL Injection',
    'Buffer Overflows',
    'Markdown',
    'Latex',
  ];

  // Update the filter tag when the user selects a new tag
  const handleTagChange = (event: SelectChangeEvent<string>) => {
    const newTag = event.target.value as string;
    setSelectedTag(newTag);
    setFilterTag(newTag); // Update the parent component's filter state
  };
  return (
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
          <FormControl size='small' sx={{ minWidth: 150 }}>
            <InputLabel id='tag-filter-label'>Filter by Tag</InputLabel>
            <Select
              labelId='tag-filter-label'
              id='tag-filter'
              value={selectedTag}
              onChange={handleTagChange}
              label='Filter by Tag'>
              <MenuItem value=''>
                <em>All Tags</em>
              </MenuItem>
              {tags.map((tag, idx) => (
                <MenuItem key={idx} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
};

export default QuestionHeader;
