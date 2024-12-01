import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import 'katex/dist/katex.min.css';
import { PresetTagName } from '../../../../types';
import MarkdownPreview from '../../markdownPreview';
import useNewQuestion from '../../../../hooks/useNewQuestion';
import useDraftPage from '../../../../hooks/useDraftPage';

export interface DraftQuestionProps {
  id: string;
  type: string;
}

const DraftQuestionPage = (draftData: DraftQuestionProps) => {
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
    postDraft,
    saveDraft,
  } = useNewQuestion();

  const { id, type } = draftData;

  const presetTagOptions = [
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

  const [selectedPresetTags, setSelectedPresetTags] = useState<string[]>([]);

  const handlePresetTagChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    if (value.length <= 5) {
      setSelectedPresetTags(value);
      setPresetTags(value.map(tag => tag as PresetTagName));
    }
  };

  const theme = useTheme();
  const question = useDraftPage(type, id, setTitle, setText, setTagNames, setSelectedPresetTags);

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
      <Typography variant='h6'>Question Preview with Markdown and LaTeX:</Typography>
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          padding: 2,
          borderRadius: 1,
        }}>
        <MarkdownPreview text={text} />
      </Box>
      <TextField
        label='Tags*'
        helperText='Add keywords separated by whitespace'
        id='formTagInput'
        value={tagNames}
        onChange={e => setTagNames(e.target.value)}
        error={!!tagErr}
        fullWidth
      />
      <Typography variant='body1'>Or select from the following tags:</Typography>
      <FormControl fullWidth>
        <InputLabel id='preset-tag-select-label'>Select Tags</InputLabel>
        <Select
          labelId='preset-tag-select-label'
          id='preset-tag-select'
          multiple
          value={selectedPresetTags}
          onChange={handlePresetTagChange}
          renderValue={selected => (selected as string[]).join(', ')}>
          {presetTagOptions.map(tag => (
            <MenuItem key={tag} value={tag}>
              <Checkbox checked={selectedPresetTags.includes(tag)} />
              <ListItemText primary={tag} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography
        variant='caption'
        sx={{
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.text.primary,
        }}>
        * Limit 5 tags
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mt: 2 }}>
          <Button
            variant='contained'
            color='primary'
            onClick={e => {
              e.preventDefault();
              if (question.question) postDraft(question.question);
            }}>
            Post Draft/Edit
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={e => {
              e.preventDefault();
              saveDraft(question.question);
            }}>
            Save Draft
          </Button>
        </Box>
        <Typography variant='caption'>* indicates mandatory fields</Typography>
      </Box>
    </Box>
  );
};

export default DraftQuestionPage;
