import React from 'react';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types';
import './index.css';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';
import ModeratorActionButtons from '../moderatorActions';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const { questionID, question, handleNewComment, handleNewAnswer } = useAnswerPage();

  if (!question) {
    return null;
  }

  const pinSortedAnswers = question.answers.sort((a1, a2) => Number(a2.pinned) - Number(a1.pinned));

  return (
    <>
      <VoteComponent question={question} />
      <AnswerHeader ansCount={question.answers.length} title={question.title} />
      <div>{ModeratorActionButtons({ type: 'question' }, question._id)}</div>
      <QuestionBody
        views={question.views.length}
        text={question.text}
        askby={question.askedBy}
        meta={getMetaData(new Date(question.askDateTime))}
        pinned={question.pinned}
        locked={question.locked}
        presetTags={question.presetTags}
      />
      <CommentSection
        comments={question.comments}
        handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
        moderatorInfo={{
          parentType: 'question',
          parentID: questionID,
          _id: undefined,
          type: 'comment',
        }}
      />
      {pinSortedAnswers.map((a, idx) => (
        <AnswerView
          key={idx}
          text={a.text}
          ansBy={a.ansBy}
          meta={getMetaData(new Date(a.ansDateTime))}
          comments={a.comments}
          locked={a.locked}
          pinned={a.pinned}
          handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
          moderatorInfo={{
            parentType: 'question',
            parentID: questionID,
            _id: a._id,
            type: 'answer',
          }}
        />
      ))}
      <button
        className='bluebtn ansButton'
        onClick={() => {
          handleNewAnswer();
        }}>
        Answer Question
      </button>
    </>
  );
};

export default AnswerPage;
