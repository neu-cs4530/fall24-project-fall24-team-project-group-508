import React from 'react';
import './index.css';
import { Box, Typography } from '@mui/material';
import { TagData } from '../../../../types';
import useTagSelected from '../../../../hooks/useTagSelected';

/**
 * Props for the Tag component.
 *
 * t - The tag object.
 * clickTag - Function to handle the tag click event.
 */
interface TagProps {
  t: TagData;
  clickTag: (tagName: string) => void;
}

/**
 * Tag component that displays information about a specific tag.
 * The component displays the tag's name, description, and the number of associated questions.
 * It also triggers a click event to handle tag selection.
 *
 * @param t - The tag object .
 * @param clickTag - Function to handle tag clicks.
 */
const TagView = ({ t, clickTag }: TagProps) => {
  const { tag } = useTagSelected(t);

  return (
    <Box
      className='tagNode'
      onClick={() => {
        clickTag(t.name);
      }}>
      <Typography
        className='tagName'
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
        }}>
        {tag.name}
      </Typography>
      <Typography className='tagDescription'>{tag.description}</Typography>
      <Typography>{t.qcnt} questions</Typography>
    </Box>
  );
};

export default TagView;
