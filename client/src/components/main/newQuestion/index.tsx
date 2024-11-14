import React from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import useNewQuestion from '../../../hooks/useNewQuestion';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import TextArea from '../baseComponents/textarea';
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
  return (
    <Form>
      <Input
        title={'Question Title'}
        hint={'Limit title to 100 characters or less'}
        id={'formTitleInput'}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <TextArea
        title={'Question Text'}
        hint={'Add details'}
        id={'formTextInput'}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title={'Tags'}
        hint={'Add keywords separated by whitespace'}
        id={'formTagInput'}
        val={tagNames}
        setState={setTagNames}
        err={tagErr}
      />
      <p className='form_tagLabel'>Or select from the following tags:</p>
      <Select
        isMulti
        options={presetTagOptions}
        onChange={handlePresetTagChange}
        placeholder='Select up to 5 tags...'
        className='form_tagSelect'
      />
      <div className='form_tagLimit'> * Limit 5 tags</div>
      <p className='form_tagLabel'></p>
      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            postQuestion();
          }}>
          Post Question
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewQuestionPage;
