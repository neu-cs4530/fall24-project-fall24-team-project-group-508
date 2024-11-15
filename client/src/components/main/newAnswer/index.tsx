import './index.css';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
// eslint-disable-next-line import/no-extraneous-dependencies
import rehypeKatex from 'rehype-katex';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'katex/dist/katex.min.css';
import Form from '../baseComponents/form';
import TextArea from '../baseComponents/textarea';
import useAnswerForm from '../../../hooks/useAnswerForm';

/**
 * NewAnswerPage component allows users to submit an answer to a specific question.
 */
const NewAnswerPage = () => {
  const { text, textErr, setText, postAnswer } = useAnswerForm();

  return (
    <Form>
      <TextArea
        title={'Answer Text'}
        id={'answerTextInput'}
        val={text}
        setState={setText}
        err={textErr}
      />
      <h4>Answer Preview with Markdown and LaTeX Support:</h4>
      <div className='markdown_preview_container'>
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {text}
        </ReactMarkdown>
      </div>
      <div className='btn_indicator_container'>
        <button className='form_postBtn' onClick={postAnswer}>
          Post Answer
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswerPage;
