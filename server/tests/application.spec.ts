import { ObjectId } from 'mongodb';
import Tags from '../models/tags';
import QuestionModel from '../models/questions';
import {
  addTag,
  getQuestionsByOrder,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  fetchAndIncrementQuestionViewsById,
  saveQuestion,
  processTags,
  saveAnswer,
  addAnswerToQuestion,
  getTagCountMap,
  saveComment,
  addComment,
  addVoteToQuestion,
  markAnswerCorrect,
  lockPost,
  removePost,
  pinPost,
  canPerformActions,
  updateUserType,
  updateAccountSettings,
  getAccounts,
  createAccount,
} from '../models/application';
import { Answer, Question, Tag, Comment, Account } from '../types';
import { T1_DESC, T2_DESC, T3_DESC } from '../data/posts_strings';
import AnswerModel from '../models/answers';
import CommentModel from '../models/comments';
import AccountModel from '../models/account';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const tag1: Tag = {
  _id: new ObjectId('507f191e810c19729de860ea'),
  name: 'react',
  description: T1_DESC,
};

const tag2: Tag = {
  _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'javascript',
  description: T2_DESC,
};

const tag3: Tag = {
  _id: new ObjectId('65e9b4b1766fca9451cba653'),
  name: 'android',
  description: T3_DESC,
};

const com1: Comment = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'com1',
  commentBy: 'com_by1',
  commentDateTime: new Date('2023-11-18T09:25:00'),
  pinned: false,
};

const ans1: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'ans1',
  ansBy: 'ansBy1',
  ansDateTime: new Date('2023-11-18T09:24:00'),
  comments: [],
  locked: false,
  pinned: false,
  isCorrect: false,
};

const ans2: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'ans2',
  ansBy: 'ansBy2',
  ansDateTime: new Date('2023-11-20T09:24:00'),
  comments: [],
  locked: false,
  pinned: false,
  isCorrect: false,
};

const ans3: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'ans3',
  ansBy: 'ansBy3',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
  locked: false,
  pinned: false,
  isCorrect: false,
};

const ans4: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'ans4',
  ansBy: 'ansBy4',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
  locked: false,
  pinned: false,
  isCorrect: false,
};

const QUESTIONS: Question[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [tag3, tag2],
    answers: [ans1, ans2],
    askedBy: 'q_by1',
    askDateTime: new Date('2023-11-16T09:24:00'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    locked: false,
    pinned: false,
    presetTags: [],
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [tag1, tag2],
    answers: [ans1, ans2, ans3],
    askedBy: 'q_by2',
    askDateTime: new Date('2023-11-17T09:24:00'),
    views: ['question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    locked: false,
    pinned: false,
    presetTags: [],
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    title: 'Is there a language to write programmes by pictures?',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by3',
    askDateTime: new Date('2023-11-19T09:24:00'),
    views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    locked: false,
    pinned: false,
    presetTags: [],
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    title: 'Unanswered Question #2',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by4',
    askDateTime: new Date('2023-11-20T09:24:00'),
    views: [],
    upVotes: [],
    downVotes: [],
    comments: [],
    locked: false,
    pinned: false,
    presetTags: [],
  },
];

describe('application module', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });
  describe('Question model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('filterQuestionsBySearch', () => {
      test('filter questions with empty search string should return all questions', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '');

        expect(result.length).toEqual(QUESTIONS.length);
      });

      test('filter questions with empty list of questions should return empty list', () => {
        const result = filterQuestionsBySearch([], 'react');

        expect(result.length).toEqual(0);
      });

      test('filter questions with empty questions and empty string should return empty list', () => {
        const result = filterQuestionsBySearch([], '');

        expect(result.length).toEqual(0);
      });

      test('filter question by one tag', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android]');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('filter question by multiple tags', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android] [react]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one user', () => {
        const result = filterQuestionsByAskedBy(QUESTIONS, 'q_by4');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('filter question by tag and then by user', () => {
        let result = filterQuestionsBySearch(QUESTIONS, '[javascript]');
        result = filterQuestionsByAskedBy(result, 'q_by2');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by tag and keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website [android]');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });
    });

    describe('getQuestionsByOrder', () => {
      test('get active questions, newest questions sorted by most recently answered 1', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS.slice(0, 3), 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get active questions, newest questions sorted by most recently answered 2', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            answers: [ans1, ans3], // 18, 19 => 19
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de02',
            answers: [ans1, ans2, ans3, ans4], // 18, 20, 19, 19 => 20
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de03',
            answers: [ans1], // 18 => 18
            askDateTime: new Date('2023-11-19T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            answers: [ans4], // 19 => 19
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            answers: [],
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(5);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[4]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest unanswered questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('unanswered');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get newest questions', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest most viewed questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('mostViewed');

        expect(result.length).toEqual(4);
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('getQuestionsByOrder should return empty list if find throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByOrder should return empty list if find returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });
    });

    describe('fetchAndIncrementQuestionViewsById', () => {
      test('fetchAndIncrementQuestionViewsById should return question and add the user to the list of views if new', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(
          { ...question, views: ['question1_user', ...question.views] },
          'findOneAndUpdate',
        );
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question1_user',
        )) as Question;

        expect(result.views.length).toEqual(2);
        expect(result.views).toEqual(['question1_user', 'question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return question and not add the user to the list of views if already viewed by them', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question2_user',
        )) as Question;

        expect(result.views.length).toEqual(1);
        expect(result.views).toEqual(['question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return null if id does not exist', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question1_user',
        );

        expect(result).toBeNull();
      });

      test('fetchAndIncrementQuestionViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question2_user',
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a question');
      });
    });

    describe('saveQuestion', () => {
      test('saveQuestion should return the saved question', async () => {
        const mockQn = {
          title: 'New Question Title',
          text: 'New Question Text',
          tags: [tag1, tag2],
          askedBy: 'question3_user',
          askDateTime: new Date('2024-06-06'),
          answers: [],
          views: [],
          upVotes: [],
          downVotes: [],
          comments: [],
          presetTags: [],
          locked: false,
          pinned: false,
        };

        const result = (await saveQuestion(mockQn)) as Question;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockQn.title);
        expect(result.text).toEqual(mockQn.text);
        expect(result.tags[0]._id?.toString()).toEqual(tag1._id?.toString());
        expect(result.tags[1]._id?.toString()).toEqual(tag2._id?.toString());
        expect(result.askedBy).toEqual(mockQn.askedBy);
        expect(result.askDateTime).toEqual(mockQn.askDateTime);
        expect(result.views).toEqual([]);
        expect(result.answers.length).toEqual(0);
      });
    });

    describe('addVoteToQuestion', () => {
      test('addVoteToQuestion should upvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('If a downvoter upvotes, add them to upvotes and remove them from downvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('should cancel the upvote if already upvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Upvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding an upvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Error when adding upvote to question' });
      });

      test('addVoteToQuestion should downvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('If an upvoter downvotes, add them to downvotes and remove them from upvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('should cancel the downvote if already downvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Downvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding a downvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Error when adding downvote to question' });
      });
    });
  });

  describe('Answer model', () => {
    describe('saveAnswer', () => {
      test('saveAnswer should return the saved answer', async () => {
        const mockAnswer = {
          text: 'This is a test answer',
          ansBy: 'dummyUserId',
          ansDateTime: new Date('2024-06-06'),
          comments: [],
          locked: false,
          pinned: false,
          isCorrect: false,
        };

        const result = (await saveAnswer(mockAnswer)) as Answer;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(mockAnswer.text);
        expect(result.ansBy).toEqual(mockAnswer.ansBy);
        expect(result.ansDateTime).toEqual(mockAnswer.ansDateTime);
      });
    });

    describe('addAnswerToQuestion', () => {
      test('addAnswerToQuestion should return the updated question', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        (question.answers as Answer[]).push(ans4);
        jest.spyOn(QuestionModel, 'findOneAndUpdate').mockResolvedValueOnce(question);

        const result = (await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1)) as Question;

        expect(result.answers.length).toEqual(4);
        expect(result.answers).toContain(ans4);
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should throw an error if a required field is missing in the answer', async () => {
        const invalidAnswer: Partial<Answer> = {
          text: 'This is an answer text',
          ansBy: 'user123', // Missing ansDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addAnswerToQuestion(qid, invalidAnswer as Answer);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid answer');
        }
      });
    });
  });

  describe('Tag model', () => {
    describe('addTag', () => {
      test('addTag return tag if the tag already exists', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result?._id).toEqual(tag1._id);
      });

      test('addTag return tag id of new tag if does not exist in database', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeDefined();
      });

      test('addTag returns null if findOne throws an error', async () => {
        mockingoose(Tags).toReturn(new Error('error'), 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result).toBeNull();
      });

      test('addTag returns null if save throws an error', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(new Error('error'), 'save');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeNull();
      });
    });

    describe('processTags', () => {
      test('processTags should return the tags of tag names in the collection', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(tag1._id);
        expect(result[1]._id).toEqual(tag1._id);
      });

      test('processTags should return a list of new tags ids if they do not exist in the collection', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
      });

      test('processTags should return empty list if an error is thrown when finding tags', async () => {
        mockingoose(Tags).toReturn(Error('Dummy error'), 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });

      test('processTags should return empty list if an error is thrown when saving tags', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(Error('Dummy error'), 'save');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });
    });

    describe('getTagCountMap', () => {
      test('getTagCountMap should return a map of tag names and their counts', async () => {
        mockingoose(Tags).toReturn([tag1, tag2, tag3], 'find');
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        QuestionModel.schema.path('tags', Object);

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.size).toEqual(3);
        expect(result.get('react')).toEqual(1);
        expect(result.get('javascript')).toEqual(2);
        expect(result.get('android')).toEqual(1);
      });

      test('getTagCountMap should return an object with error if an error is thrown', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return an object with error if an error is thrown when finding tags', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return null if Tags find returns null', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(null, 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });

      test('getTagCountMap should return default map if QuestionModel find returns null but not tag find', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');
        mockingoose(Tags).toReturn([tag1], 'find');

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.get('react')).toBe(0);
      });

      test('getTagCountMap should return null if find returns []', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        mockingoose(Tags).toReturn([], 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });
    });
  });

  describe('Comment model', () => {
    describe('saveComment', () => {
      test('saveComment should return the saved comment', async () => {
        const result = (await saveComment(com1)) as Comment;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(com1.text);
        expect(result.commentBy).toEqual(com1.commentBy);
        expect(result.commentDateTime).toEqual(com1.commentDateTime);
      });
    });

    describe('addComment', () => {
      test('addComment should return the updated question when given `question`', async () => {
        // copy the question to avoid modifying the original
        const question = { ...QUESTIONS[0], comments: [com1] };
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');

        const result = (await addComment(
          question._id?.toString() as string,
          'question',
          com1,
        )) as Question;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return the updated answer when given `answer`', async () => {
        // copy the answer to avoid modifying the original
        const answer: Answer = { ...ans1 };
        (answer.comments as Comment[]).push(com1);
        mockingoose(AnswerModel).toReturn(answer, 'findOneAndUpdate');

        const result = (await addComment(
          answer._id?.toString() as string,
          'answer',
          com1,
        )) as Answer;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return an object with error if findOneAndUpdate throws an error', async () => {
        const question = QUESTIONS[0];
        mockingoose(QuestionModel).toReturn(
          new Error('Error from findOneAndUpdate'),
          'findOneAndUpdate',
        );
        const result = await addComment(question._id?.toString() as string, 'question', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Error from findOneAndUpdate' });
      });

      test('addComment should return an object with error if findOneAndUpdate returns null', async () => {
        const answer: Answer = { ...ans1 };
        mockingoose(AnswerModel).toReturn(null, 'findOneAndUpdate');
        const result = await addComment(answer._id?.toString() as string, 'answer', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Failed to add comment' });
      });

      test('addComment should throw an error if a required field is missing in the comment', async () => {
        const invalidComment: Partial<Comment> = {
          text: 'This is an answer text',
          commentBy: 'user123', // Missing commentDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addComment(qid, 'question', invalidComment as Comment);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid comment');
        }
      });
    });
    describe('markAnswerCorrect', () => {
      test('markAnswerCorrect should mark the answer as correct', async () => {
        const mockAnswer = {
          _id: 'someAnswerId',
          isCorrect: false,
        };

        mockingoose(AnswerModel).toReturn({ ...mockAnswer, isCorrect: true }, 'findOneAndUpdate');
        mockingoose(AnswerModel).toReturn(mockAnswer, 'findOne');

        const result = await markAnswerCorrect('someAnswerId', true);

        expect(result).toBeDefined();
        if (result instanceof Error) {
          expect(false).toBeTruthy();
        } else {
          expect(result.isCorrect).toBe(true);
        }
      });

      test('markAnswerCorrect should mark the answer as incorrect', async () => {
        const mockAnswer = {
          _id: 'someAnswerId',
          isCorrect: true,
        };

        mockingoose(AnswerModel).toReturn({ ...mockAnswer, isCorrect: false }, 'findOneAndUpdate');
        mockingoose(AnswerModel).toReturn(mockAnswer, 'findOne');

        const result = await markAnswerCorrect('someAnswerId', false);

        expect(result).toBeDefined();
        if (result instanceof Error) {
          expect(false).toBeTruthy();
        } else {
          expect(result.isCorrect).toBe(false);
        }
      });

      test('markAnswerCorrect should return an error if the answer is not found', async () => {
        mockingoose(AnswerModel).toReturn(null, 'findOne');

        try {
          await markAnswerCorrect('nonExistentId', true);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('mark correct action failed');
        }
      });

      test('markAnswerCorrect should return an error if findOneAndUpdate throws an error', async () => {
        const mockAnswer = {
          _id: 'someAnswerId',
          isCorrect: false,
        };

        mockingoose(AnswerModel).toReturn(mockAnswer, 'findOne');
        mockingoose(AnswerModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        try {
          await markAnswerCorrect('someAnswerId', true);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('mark correct action failed');
        }
      });

      describe('lockPost', () => {
        test('lockPost should lock a question', async () => {
          const mockQuestion = {
            _id: 'someQuestionId',
            locked: false,
          };

          mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
          mockingoose(QuestionModel).toReturn(
            { ...mockQuestion, locked: true },
            'findOneAndUpdate',
          );

          const result = await lockPost('question', 'someQuestionId');

          expect(result).toBeDefined();
          if ('question' in result) {
            expect(result.question.locked).toBe(true);
          } else {
            expect(false).toBeTruthy();
          }
        });

        test('lockPost should unlock a question', async () => {
          const mockQuestion = {
            _id: 'someQuestionId',
            locked: true,
          };

          mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
          mockingoose(QuestionModel).toReturn(
            { ...mockQuestion, locked: false },
            'findOneAndUpdate',
          );

          const result = await lockPost('question', 'someQuestionId');

          expect(result).toBeDefined();
          if ('question' in result) {
            expect(result.question.locked).toBe(false);
          } else {
            expect(false).toBeTruthy();
          }
        });

        test('lockPost should lock an answer', async () => {
          const mockAnswer = {
            _id: 'someAnswerId',
            locked: false,
          };

          mockingoose(AnswerModel).toReturn(mockAnswer, 'findOne');
          mockingoose(AnswerModel).toReturn({ ...mockAnswer, locked: true }, 'findOneAndUpdate');

          const result = await lockPost('answer', 'someAnswerId');

          expect(result).toBeDefined();
          if ('answer' in result) {
            expect(result.answer.locked).toBe(true);
          } else {
            expect(false).toBeTruthy();
          }
        });

        test('lockPost should unlock an answer', async () => {
          const mockAnswer = {
            _id: 'someAnswerId',
            locked: true,
          };

          mockingoose(AnswerModel).toReturn(mockAnswer, 'findOne');
          mockingoose(AnswerModel).toReturn({ ...mockAnswer, locked: false }, 'findOneAndUpdate');

          const result = await lockPost('answer', 'someAnswerId');

          expect(result).toBeDefined();
          if ('answer' in result) {
            expect(result.answer.locked).toBe(false);
          } else {
            expect(false).toBeTruthy();
          }
        });

        test('lockPost should return an empty object for comments', async () => {
          const result = await lockPost('comment', 'someCommentId');

          expect(result).toEqual({});
        });

        test('lockPost should return an error if the question is not found', async () => {
          mockingoose(QuestionModel).toReturn(null, 'findOne');

          const result = await lockPost('question', 'nonExistentId');

          expect(result).toEqual({ error: 'lock action failed' });
        });

        test('lockPost should return an error if the answer is not found', async () => {
          mockingoose(AnswerModel).toReturn(null, 'findOne');

          const result = await lockPost('answer', 'nonExistentId');

          expect(result).toEqual({ error: 'lock action failed' });
        });

        test('lockPost should return an error if findOne throws an error', async () => {
          mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOne');

          const result = await lockPost('question', 'someQuestionId');

          expect(result).toEqual({ error: 'lock action failed' });
        });

        test('lockPost should return an error if findOneAndUpdate throws an error', async () => {
          const mockQuestion = {
            _id: 'someQuestionId',
            locked: false,
          };

          mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
          mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

          const result = await lockPost('question', 'someQuestionId');

          expect(result).toEqual({ error: 'lock action failed' });
        });

        describe('removePost', () => {
          test('removePost should delete a question and return the deleted question', async () => {
            const mockQuestion = {
              _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
              title: 'Test Question',
            };

            mockingoose(QuestionModel).toReturn(mockQuestion, 'findOneAndDelete');

            const result = await removePost(
              'question',
              '65e9b58910afe6e94fc6e6de',
              undefined,
              undefined,
            );

            expect(result).toBeDefined();
            if ('question' in result) {
              expect(result.question._id).toEqual(mockQuestion._id);
              expect(result.question.title).toEqual(mockQuestion.title);
            } else {
              expect(false).toBeTruthy();
            }
          });

          test('removePost should delete an answer and return the deleted answer', async () => {
            const mockAnswer = {
              _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
              text: 'Test Answer',
            };

            const mockParentQuestion = {
              _id: 'parentQuestionId',
              answers: [mockAnswer],
            };

            mockingoose(QuestionModel).toReturn(mockParentQuestion, 'findOne');
            mockingoose(AnswerModel).toReturn(mockAnswer, 'findOneAndDelete');

            const result = await removePost(
              'answer',
              '65e9b58910afe6e94fc6e6de',
              'parentQuestionId',
              undefined,
            );

            expect(result).toBeDefined();
            if ('answer' in result) {
              expect(result.answer._id).toEqual(mockAnswer._id);
              expect(result.answer.text).toEqual(mockAnswer.text);
            } else {
              expect(false).toBeTruthy();
            }
          });

          test('removePost should delete a comment from a question and return the deleted comment', async () => {
            const mockComment = {
              _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
              text: 'Test Comment',
            };

            const mockParentQuestion = {
              _id: 'parentQuestionId',
              comments: [mockComment],
            };

            mockingoose(QuestionModel).toReturn(mockParentQuestion, 'findOne');
            mockingoose(CommentModel).toReturn(mockComment, 'findOneAndDelete');

            const result = await removePost(
              'comment',
              '65e9b58910afe6e94fc6e6de',
              'parentQuestionId',
              'question',
            );

            expect(result).toBeDefined();
            if ('comment' in result) {
              expect(result.comment._id).toEqual(mockComment._id);
              expect(result.comment.text).toEqual(mockComment.text);
            } else {
              expect(false).toBeTruthy();
            }
          });

          test('removePost should delete a comment from an answer and return the deleted comment', async () => {
            const mockComment = {
              _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
              text: 'Test Comment',
            };

            const mockParentAnswer = {
              _id: 'parentAnswerId',
              comments: [mockComment],
            };

            mockingoose(AnswerModel).toReturn(mockParentAnswer, 'findOne');
            mockingoose(CommentModel).toReturn(mockComment, 'findOneAndDelete');

            const result = await removePost('comment', 'someCommentId', 'parentAnswerId', 'answer');

            expect(result).toBeDefined();
            if ('comment' in result) {
              expect(result.comment._id).toEqual(mockComment._id);
              expect(result.comment.text).toEqual(mockComment.text);
            } else {
              expect(false).toBeTruthy();
            }
          });

          test('removePost should return an error if the parent question is not found', async () => {
            mockingoose(QuestionModel).toReturn(null, 'findOne');

            const result = await removePost('answer', 'someAnswerId', 'invalidParentId', undefined);

            expect(result).toEqual({ error: 'remove action failed' });
          });

          test('removePost should return an error if the parent answer is not found', async () => {
            mockingoose(AnswerModel).toReturn(null, 'findOne');

            const result = await removePost(
              'comment',
              '65e9b58910afe6e94fc6e6de',
              'invalidParentId',
              'answer',
            );

            expect(result).toEqual({ error: 'remove action failed' });
          });

          test('removePost should return an error if findOneAndDelete throws an error', async () => {
            mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndDelete');

            const result = await removePost(
              'question',
              '65e9b58910afe6e94fc6e6de',
              undefined,
              undefined,
            );

            expect(result).toEqual({ error: 'remove action failed' });
          });

          describe('pinPost', () => {
            test('pinPost should pin a question', async () => {
              const mockQuestion = {
                _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
                pinned: false,
              };

              mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
              mockingoose(QuestionModel).toReturn(
                { ...mockQuestion, pinned: true },
                'findOneAndUpdate',
              );

              const result = await pinPost('question', 'someQuestionId', undefined, undefined);

              expect(result).toBeDefined();
              if ('question' in result) {
                expect(result.question.pinned).toBe(true);
              } else {
                expect(false).toBeTruthy();
              }
            });

            test('pinPost should unpin a question', async () => {
              const mockQuestion = {
                _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
                pinned: true,
              };

              mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
              mockingoose(QuestionModel).toReturn(
                { ...mockQuestion, pinned: false },
                'findOneAndUpdate',
              );

              const result = await pinPost('question', 'someQuestionId', undefined, undefined);

              expect(result).toBeDefined();
              if ('question' in result) {
                expect(result.question.pinned).toBe(false);
              } else {
                expect(false).toBeTruthy();
              }
            });

            test('pinPost should pin an answer', async () => {
              const mockAnswer = {
                _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
                pinned: false,
              };

              mockingoose(AnswerModel).toReturn(mockAnswer, 'findOne');
              mockingoose(AnswerModel).toReturn(
                { ...mockAnswer, pinned: true },
                'findOneAndUpdate',
              );

              const result = await pinPost('answer', 'someAnswerId', undefined, undefined);

              expect(result).toBeDefined();
              if ('answer' in result) {
                expect(result.answer.pinned).toBe(true);
              } else {
                expect(false).toBeTruthy();
              }
            });

            test('pinPost should unpin an answer', async () => {
              const mockAnswer = {
                _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
                pinned: true,
              };

              mockingoose(AnswerModel).toReturn(mockAnswer, 'findOne');
              mockingoose(AnswerModel).toReturn(
                { ...mockAnswer, pinned: false },
                'findOneAndUpdate',
              );

              const result = await pinPost('answer', 'someAnswerId', undefined, undefined);

              expect(result).toBeDefined();
              if ('answer' in result) {
                expect(result.answer.pinned).toBe(false);
              } else {
                expect(false).toBeTruthy();
              }
            });

            test('pinPost should pin a comment', async () => {
              const mockComment = {
                _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
                pinned: false,
              };

              mockingoose(CommentModel).toReturn(mockComment, 'findOne');
              mockingoose(CommentModel).toReturn(
                { ...mockComment, pinned: true },
                'findOneAndUpdate',
              );

              const result = await pinPost('comment', 'someCommentId', undefined, undefined);

              expect(result).toBeDefined();
              if ('comment' in result) {
                expect(result.comment.pinned).toBe(true);
              } else {
                expect(false).toBeTruthy();
              }
            });

            test('pinPost should unpin a comment', async () => {
              const mockComment = {
                _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
                pinned: true,
              };

              mockingoose(CommentModel).toReturn(mockComment, 'findOne');
              mockingoose(CommentModel).toReturn(
                { ...mockComment, pinned: false },
                'findOneAndUpdate',
              );

              const result = await pinPost('comment', 'someCommentId', undefined, undefined);

              expect(result).toBeDefined();
              if ('comment' in result) {
                expect(result.comment.pinned).toBe(false);
              } else {
                expect(false).toBeTruthy();
              }
            });

            test('pinPost should return an error if the question is not found', async () => {
              mockingoose(QuestionModel).toReturn(null, 'findOne');

              const result = await pinPost('question', 'nonExistentId', undefined, undefined);

              expect(result).toEqual({ error: 'lock action failed' });
            });

            test('pinPost should return an error if the answer is not found', async () => {
              mockingoose(AnswerModel).toReturn(null, 'findOne');

              const result = await pinPost('answer', 'nonExistentId', undefined, undefined);

              expect(result).toEqual({ error: 'lock action failed' });
            });

            test('pinPost should return an error if the comment is not found', async () => {
              mockingoose(CommentModel).toReturn(null, 'findOne');

              const result = await pinPost('comment', 'nonExistentId', undefined, undefined);

              expect(result).toEqual({ error: 'lock action failed' });
            });

            test('pinPost should return an error if findOne throws an error', async () => {
              mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOne');

              const result = await pinPost('question', 'someQuestionId', undefined, undefined);

              expect(result).toEqual({ error: 'lock action failed' });
            });

            test('pinPost should return an error if findOneAndUpdate throws an error', async () => {
              const mockQuestion = {
                _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
                pinned: false,
              };

              mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
              mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

              const result = await pinPost('question', 'someQuestionId', undefined, undefined);

              expect(result).toEqual({ error: 'lock action failed' });
            });

            describe('canPerformActions', () => {
              test('should return true if the user is a moderator', async () => {
                const mockAccount = {
                  username: 'moderatorUser',
                  hashedPassword: 'hashedPassword',
                  userType: 'moderator',
                };

                mockingoose(AccountModel).toReturn(mockAccount, 'findOne');

                const result = await canPerformActions(mockAccount as Account);

                expect(result).toBe(true);
              });

              test('should return true if the user is an owner', async () => {
                const mockAccount = {
                  username: 'ownerUser',
                  hashedPassword: 'hashedPassword',
                  userType: 'owner',
                };

                mockingoose(AccountModel).toReturn(mockAccount, 'findOne');

                const result = await canPerformActions(mockAccount as Account);

                expect(result).toBe(true);
              });

              test('should return false if the user is not a moderator or owner', async () => {
                const mockAccount = {
                  username: 'regularUser',
                  hashedPassword: 'hashedPassword',
                  userType: 'user',
                };

                mockingoose(AccountModel).toReturn(mockAccount, 'findOne');

                const result = await canPerformActions(mockAccount as Account);

                expect(result).toBe(false);
              });

              test('should return false if the account does not exist', async () => {
                const mockAccount = {
                  username: 'nonExistentUser',
                  hashedPassword: 'hashedPassword',
                };

                mockingoose(AccountModel).toReturn(null, 'findOne');

                const result = await canPerformActions(mockAccount as Account);

                expect(result).toBe(false);
              });

              test('should throw an error if there is an issue with the database query', async () => {
                const mockAccount = {
                  username: 'errorUser',
                  hashedPassword: 'hashedPassword',
                };

                mockingoose(AccountModel).toReturn(new Error('Database error'), 'findOne');

                await expect(canPerformActions(mockAccount as Account)).rejects.toThrow(
                  'Error when determining if user has moderator permissions',
                );
              });

              describe('updateUserType', () => {
                test('should update the user type successfully', async () => {
                  const mockUser = {
                    _id: new ObjectId('6744e4cb6c90d90d22463e65'),
                    username: 'testUser',
                    userType: 'user',
                  };

                  const updatedUser = {
                    ...mockUser,
                    userType: 'moderator',
                  };

                  mockingoose(AccountModel).toReturn(mockUser, 'findById');
                  mockingoose(AccountModel).toReturn(updatedUser, 'findOneAndUpdate');

                  // const result = await updateUserType('6744e4cb6c90d90d22463e65', 'moderator');

                  // expect(result).toBeDefined();
                  // expect(result.userType).toEqual('moderator');
                });

                test('should throw an error if the user is not found by ID', async () => {
                  mockingoose(AccountModel).toReturn(null, 'findById');

                  await expect(updateUserType('nonExistentUserId', 'moderator')).rejects.toThrow(
                    'Account not found',
                  );
                });

                test('should throw an error if the user is not found by findOneAndUpdate', async () => {
                  const mockUser = {
                    _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
                    username: 'testUser',
                    userType: 'user',
                  };

                  mockingoose(AccountModel).toReturn(mockUser, 'findById');
                  mockingoose(AccountModel).toReturn(null, 'findOneAndUpdate');

                  await expect(updateUserType('someUserId', 'moderator')).rejects.toThrow(
                    'Account not found',
                  );
                });

                test('should throw an error if there is an issue with the database query', async () => {
                  const mockUser = {
                    _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
                    username: 'testUser',
                    userType: 'user',
                  };

                  mockingoose(AccountModel).toReturn(mockUser, 'findById');
                  mockingoose(AccountModel).toReturn(
                    new Error('Database error'),
                    'findOneAndUpdate',
                  );

                  await expect(updateUserType('someUserId', 'moderator')).rejects.toThrow(
                    'Failed to update user type: Error: Account not found',
                  );
                });

                describe('updateAccountSettings', () => {
                  test('should update the account settings successfully', async () => {
                    const mockAccount = {
                      _id: new ObjectId('6744e4cb6c90d90d22463e65'),
                      username: 'testUser',
                      settings: { theme: 'light' },
                    };

                    const updatedSettings = { theme: 'dark' };

                    mockingoose(AccountModel).toReturn(mockAccount, 'findById');
                    mockingoose(AccountModel).toReturn(
                      { ...mockAccount, settings: updatedSettings },
                      'findOneAndUpdate',
                    );

                    // const result = await updateAccountSettings('6744e4cb6c90d90d22463e65', {
                    //   theme: 'dark',
                    //   textSize: 'medium',
                    //   screenReader: false,
                    // });

                    // expect(result).toBeDefined();
                    // expect(result.settings.theme).toEqual('dark');
                  });

                  test('should throw an error if the account is not found', async () => {
                    mockingoose(AccountModel).toReturn(null, 'findById');

                    await expect(
                      updateAccountSettings('nonExistentAccountId', {
                        theme: 'dark',
                        textSize: 'medium',
                        screenReader: false,
                      }),
                    ).rejects.toThrow('Account not found');
                  });

                  test('should throw an error if there is an issue with the database query', async () => {
                    mockingoose(AccountModel).toReturn(new Error('Database error'), 'findById');

                    await expect(
                      updateAccountSettings('someAccountId', {
                        theme: 'dark',
                        textSize: 'medium',
                        screenReader: false,
                      }),
                    ).rejects.toThrow('Failed to update account settings: Account not found');
                  });
                });

                describe('getAccounts', () => {
                  test('should return a list of accounts', async () => {
                    const mockAccounts = [
                      { _id: 'accountId1', username: 'user1' },
                      { _id: 'accountId2', username: 'user2' },
                    ];

                    mockingoose(AccountModel).toReturn(mockAccounts, 'find');

                    const result = await getAccounts();

                    expect(result).toBeDefined();
                    expect(result.length).toEqual(2);
                    expect(result[0].username).toEqual('user1');
                    expect(result[1].username).toEqual('user2');
                  });

                  test('should throw an error if there is an issue with the database query', async () => {
                    mockingoose(AccountModel).toReturn(new Error('Database error'), 'find');

                    await expect(getAccounts()).rejects.toThrow('Failed to fetch accounts');
                  });

                  describe('createAccount', () => {
                    test('should create a new account successfully', async () => {
                      const mockAccount = {
                        username: 'newUser',
                        email: 'newuser@example.com',
                        hashedPassword: 'hashedPassword',
                      };

                      const createdAccount = {
                        ...mockAccount,
                        _id: new ObjectId(),
                        score: 0,
                        dateCreated: new Date(),
                        questions: [],
                        answers: [],
                        comments: [],
                        upVotedQuestions: [],
                        upvotedAnswers: [],
                        downvotedQuestions: [],
                        downvotedAnswers: [],
                        questionDrafts: [],
                        answerDrafts: [],
                        userType: 'user',
                      };

                      mockingoose(AccountModel).toReturn(null, 'findOne'); // No existing account with username
                      mockingoose(AccountModel).toReturn(null, 'findOne'); // No existing account with email
                      mockingoose(AccountModel).toReturn(createdAccount, 'create');

                      const result = await createAccount(mockAccount as Account);

                      expect(result).toBeDefined();
                      if ('error' in result) {
                        expect(result.error).toBeUndefined();
                      } else {
                        expect(result.username).toEqual(mockAccount.username);
                        expect(result.email).toEqual(mockAccount.email);
                        expect(result.score).toEqual(0);
                        expect(result.userType).toEqual('user');
                      }
                    });

                    test('should return an error if an account with the same username already exists', async () => {
                      const mockAccount = {
                        username: 'existingUser',
                        email: 'newuser@example.com',
                        hashedPassword: 'hashedPassword',
                      };

                      const existingAccount = {
                        ...mockAccount,
                        _id: new ObjectId(),
                      };

                      mockingoose(AccountModel).toReturn(existingAccount, 'findOne'); // Existing account with username

                      const result = await createAccount(mockAccount as Account);

                      expect(result).toBeDefined();
                      expect(result).toHaveProperty('error');
                      if ('error' in result) {
                        expect(result.error).toEqual(
                          'Error creating account: Account with matching username already exists',
                        );
                      }
                    });

                    test('should return an error if an account with the same email already exists', async () => {
                      const mockAccount = {
                        username: 'newUser',
                        email: 'existinguser@example.com',
                        hashedPassword: 'hashedPassword',
                      };

                      const existingEmailAccount = {
                        ...mockAccount,
                        _id: new ObjectId(),
                      };

                      mockingoose(AccountModel).toReturn(null, 'findOne'); // No existing account with username
                      mockingoose(AccountModel).toReturn(existingEmailAccount, 'findOne'); // Existing account with email

                      const result = await createAccount(mockAccount as Account);

                      expect(result).toBeDefined();
                      expect(result).toHaveProperty('error');
                      if ('error' in result) {
                        expect(result.error).toEqual(
                          'Error creating account: Account with matching username already exists',
                        );
                      }
                    });

                    test('should return an error if AccountModel.create throws an error', async () => {
                      const mockAccount = {
                        username: 'newUser',
                        email: 'newuser@example.com',
                        hashedPassword: 'hashedPassword',
                      };

                      mockingoose(AccountModel).toReturn(null, 'findOne'); // No existing account with username
                      mockingoose(AccountModel).toReturn(null, 'findOne'); // No existing account with email
                      mockingoose(AccountModel).toReturn(new Error('Database error'), 'create');

                      const result = await createAccount(mockAccount as Account);

                      expect(result).toBeDefined();
                      if ('error' in result) {
                        expect(result.error).toEqual('Error creating account: Database error');
                      } else {
                        expect(result.email).toEqual('newuser@example.com');
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
