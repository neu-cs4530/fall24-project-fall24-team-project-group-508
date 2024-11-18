import React from 'react';
import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import Select, { ActionMeta, MultiValue } from 'react-select';
import useNewQuestion from '../../../hooks/useNewQuestion';
import './index.css';
import { PresetTagName } from '../../../types';

/**
 * NewQuestionPage component allows users to submit a new question with a title,
 * description, tags, and username.
 */
const NewQuestionPage = () => {
  const {
    title,
    setTitle,
    text,
    setText,
    tagNames,
    setTagNames,
    setPresetTags,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  } = useNewQuestion();

  // List of preset tags for the dropdown
  const presetTagOptions = [
    { value: 'C', label: 'C' },
    { value: 'C++', label: 'C++' },
    { value: 'Java', label: 'Java' },
    { value: 'Python', label: 'Python' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'SQL', label: 'SQL' },
    { value: 'MongoDB', label: 'MongoDB' },
    { value: 'React', label: 'React' },
    { value: 'Angular', label: 'Angular' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'OOD', label: 'OOD' },
    { value: 'SWE', label: 'SWE' },
    { value: 'Algorithms', label: 'Algorithms' },
    { value: 'Data Structures', label: 'Data Structures' },
    { value: 'Testing', label: 'Testing' },
    { value: 'Debugging', label: 'Debugging' },
    { value: 'Version Control', label: 'Version Control' },
    { value: 'Security', label: 'Security' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Cloud Computing', label: 'Cloud Computing' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Agile', label: 'Agile' },
    { value: 'Scrum', label: 'Scrum' },
    { value: 'Kanban', label: 'Kanban' },
    { value: 'CI/CD', label: 'CI/CD' },
    { value: 'Docker', label: 'Docker' },
    { value: 'Kubernetes', label: 'Kubernetes' },
    { value: 'Microservices', label: 'Microservices' },
    { value: 'Serverless', label: 'Serverless' },
    { value: 'RESTful APIs', label: 'RESTful APIs' },
    { value: 'GraphQL', label: 'GraphQL' },
    { value: 'WebSockets', label: 'WebSockets' },
    { value: 'OAuth', label: 'OAuth' },
    { value: 'JWT', label: 'JWT' },
    { value: 'Cookies', label: 'Cookies' },
    { value: 'Sessions', label: 'Sessions' },
    { value: 'SQL Injection', label: 'SQL Injection' },
    { value: 'Buffer Overflows', label: 'Buffer Overflows' },
    { value: 'Markdown', label: 'Markdown' },
    { value: 'Latex', label: 'Latex' },
  ];

  const handlePresetTagChange = (
    selectedOptions: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>,
  ) => {
    if (selectedOptions.length <= 5) {
      setPresetTags(selectedOptions.map(option => option.value as PresetTagName));
    }
  };
  const theme = useTheme();

  return (
    <Box
      component='form'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 600,
        marginTop: 5,
      }}>
      <TextField
        label='Question Title*'
        helperText='Limit title to 100 characters or less'
        id='formTitleInput'
        value={title}
        onChange={e => setTitle(e.target.value)}
        error={!!titleErr}
        fullWidth
      />
      <TextField
        label='Question Text*'
        helperText='Add details'
        id='formTextInput'
        value={text}
        onChange={e => setText(e.target.value)}
        error={!!textErr}
        multiline
        rows={4}
        fullWidth
      />
      <TextField
        label='Tags*'
        helperText='Add keywords separated by whitespace'
        id='formTagInput'
        value={tagNames}
        onChange={e => setTagNames(e.target.value)}
        error={!!tagErr}
        fullWidth
      />
      <Typography variant='body1' className='form_tagLabel'>
        Or select from the following tags:
      </Typography>
      <Select
        isMulti
        options={presetTagOptions}
        onChange={handlePresetTagChange}
        placeholder='Select up to 5 tags...'
        className='form_tagSelect'
      />
      <Typography
        variant='caption'
        className='form_tagLimit'
        sx={{
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.text.primary,
        }}>
        * Limit 5 tags
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={e => {
            e.preventDefault();
            postQuestion();
          }}>
          Post Question
        </Button>
        <Typography variant='caption' className='mandatory_indicator'>
          * indicates mandatory fields
        </Typography>
      </Box>
    </Box>
  );
};

export default NewQuestionPage;
