/* eslint-disable no-console */
import { ObjectId } from 'mongodb';
import { QueryOptions } from 'mongoose';
import {
  Answer,
  AnswerResponse,
  Comment,
  CommentResponse,
  ActionResponse,
  OrderType,
  Question,
  QuestionResponse,
  Tag,
  AccountResponse,
  Account,
  DraftQuestion,
  DraftAnswer,
  DraftQuestionPayload,
  DraftAnswerPayload,
} from '../types';
import AnswerModel from './answers';
import QuestionModel from './questions';
import TagModel from './tags';
import CommentModel from './comments';
import AccountModel from './account';
import DraftAnswerModel from './draftsAnswers';
import DraftQuestionModel from './draftQuestions';

/**
 * Parses tags from a search string.
 *
 * @param {string} search - Search string containing tags in square brackets (e.g., "[tag1][tag2]")
 *
 * @returns {string[]} - An array of tags found in the search string
 */
const parseTags = (search: string): string[] =>
  (search.match(/\[([^\]]+)\]/g) || []).map(word => word.slice(1, -1));

/**
 * Parses keywords from a search string by removing tags and extracting individual words.
 *
 * @param {string} search - The search string containing keywords and possibly tags
 *
 * @returns {string[]} - An array of keywords found in the search string
 */
const parseKeyword = (search: string): string[] =>
  search.replace(/\[([^\]]+)\]/g, ' ').match(/\b\w+\b/g) || [];

/**
 * Checks if given question contains any tags from the given list.
 *
 * @param {Question} q - The question to check
 * @param {string[]} taglist - The list of tags to check for
 *
 * @returns {boolean} - `true` if any tag is present in the question, `false` otherwise
 */
const checkTagInQuestion = (q: Question, taglist: string[]): boolean => {
  for (const tagname of taglist) {
    for (const tag of q.tags) {
      if (tagname === tag.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks if any keywords in the provided list exist in a given question's title or text.
 *
 * @param {Question} q - The question to check
 * @param {string[]} keywordlist - The list of keywords to check for
 *
 * @returns {boolean} - `true` if any keyword is present, `false` otherwise.
 */
const checkKeywordInQuestion = (q: Question, keywordlist: string[]): boolean => {
  for (const w of keywordlist) {
    if (q.title.includes(w) || q.text.includes(w)) {
      return true;
    }
  }

  return false;
};

/**
 * Gets the newest questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to sort
 *
 * @returns {Question[]} - The sorted list of questions
 */
const sortQuestionsByNewest = (qlist: Question[]): Question[] =>
  qlist.sort((a, b) => {
    if (a.askDateTime > b.askDateTime) {
      return -1;
    }

    if (a.askDateTime < b.askDateTime) {
      return 1;
    }

    return 0;
  });

/**
 * Gets unanswered questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of unanswered questions
 */
const sortQuestionsByUnanswered = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).filter(q => q.answers.length === 0);

/**
 * Records the most recent answer time for a question.
 *
 * @param {Question} question - The question to check
 * @param {Map<string, Date>} mp - A map of the most recent answer time for each question
 */
const getMostRecentAnswerTime = (question: Question, mp: Map<string, Date>): void => {
  // This is a private function and we can assume that the answers field is not undefined or an array of ObjectId
  const answers = question.answers as Answer[];
  answers.forEach((answer: Answer) => {
    if (question._id !== undefined) {
      const currentMostRecent = mp.get(question?._id.toString());
      if (!currentMostRecent || currentMostRecent < answer.ansDateTime) {
        mp.set(question._id.toString(), answer.ansDateTime);
      }
    }
  });
};

/**
 * Gets active questions from a list, sorted by the most recent answer date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of active questions
 */
const sortQuestionsByActive = (qlist: Question[]): Question[] => {
  const mp = new Map();
  qlist.forEach(q => {
    getMostRecentAnswerTime(q, mp);
  });

  return sortQuestionsByNewest(qlist).sort((a, b) => {
    const adate = mp.get(a._id?.toString());
    const bdate = mp.get(b._id?.toString());
    if (!adate) {
      return 1;
    }
    if (!bdate) {
      return -1;
    }
    if (adate > bdate) {
      return -1;
    }
    if (adate < bdate) {
      return 1;
    }
    return 0;
  });
};

/**
 * Sorts a list of questions by the number of views in descending order. First, the questions are
 * sorted by creation date (newest first), then by number of views, from highest to lowest.
 * If questions have the same number of views, the newer question will be before the older question.
 *
 * @param qlist The array of Question objects to be sorted.
 *
 * @returns A new array of Question objects sorted by the number of views.
 */
const sortQuestionsByMostViews = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).sort((a, b) => b.views.length - a.views.length);

/**
 * Adds a tag to the database if it does not already exist.
 *
 * @param {Tag} tag - The tag to add
 *
 * @returns {Promise<Tag | null>} - The added or existing tag, or `null` if an error occurred
 */
export const addTag = async (tag: Tag): Promise<Tag | null> => {
  try {
    // Check if a tag with the given name already exists
    const existingTag = await TagModel.findOne({ name: tag.name });

    if (existingTag) {
      return existingTag as Tag;
    }

    // If the tag does not exist, create a new one
    const newTag = new TagModel(tag);
    const savedTag = await newTag.save();

    return savedTag as Tag;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves questions from the database, ordered by the specified criteria.
 *
 * @param {OrderType} order - The order type to filter the questions
 *
 * @returns {Promise<Question[]>} - Promise that resolves to a list of ordered questions
 */
export const getQuestionsByOrder = async (order: OrderType): Promise<Question[]> => {
  try {
    let qlist = [];
    if (order === 'active') {
      qlist = await QuestionModel.find().populate([
        { path: 'tags', model: TagModel },
        { path: 'answers', model: AnswerModel },
      ]);
      return sortQuestionsByActive(qlist);
    }
    qlist = await QuestionModel.find().populate([{ path: 'tags', model: TagModel }]);
    if (order === 'unanswered') {
      return sortQuestionsByUnanswered(qlist);
    }
    if (order === 'newest') {
      return sortQuestionsByNewest(qlist);
    }
    return sortQuestionsByMostViews(qlist);
  } catch (error) {
    return [];
  }
};

/**
 * Filters a list of questions by the user who asked them.
 *
 * @param qlist The array of Question objects to be filtered.
 * @param askedBy The username of the user who asked the questions.
 *
 * @returns Filtered Question objects.
 */
export const filterQuestionsByAskedBy = (qlist: Question[], askedBy: string): Question[] =>
  qlist.filter(q => q.askedBy === askedBy);

/**
 * Filters questions based on a search string containing tags and/or keywords.
 * Prioritizes questions with a high upvote/downvote ratio, then prioritzes questions
 * with the 'Markdown' tag.
 *
 * @param {Question[]} qlist - The list of questions to filter
 * @param {string} search - The search string containing tags and/or keywords
 *
 * @returns {Question[]} - The filtered list of questions matching the search criteria
 */
export const filterQuestionsBySearch = (qlist: Question[], search: string): Question[] => {
  const searchTags = parseTags(search);
  const searchKeyword = parseKeyword(search);

  if (!qlist || qlist.length === 0) {
    return [];
  }
  const filteredQuestions = qlist.filter((q: Question) => {
    if (searchKeyword.length === 0 && searchTags.length === 0) {
      return true;
    }
    if (searchKeyword.length === 0) {
      return checkTagInQuestion(q, searchTags);
    }
    if (searchTags.length === 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    }
    return checkTagInQuestion(q, searchKeyword) || checkKeywordInQuestion(q, searchTags);
  });
  const sortedQuestions = filteredQuestions.sort((a, b) => {
    const aRatio = a.upVotes.length / (a.downVotes.length || 1);
    const bRatio = b.upVotes.length / (b.downVotes.length || 1);

    if (aRatio > bRatio) {
      return bRatio - aRatio;
    }

    const aMarkdownQ = a.tags.some(tag => tag.name === 'Markdown');
    const bMarkdownQ = b.tags.some(tag => tag.name === 'Markdown');
    if (aMarkdownQ && !bMarkdownQ) {
      return -1;
    }
    if (!aMarkdownQ && bMarkdownQ) {
      return 1;
    }
    return 0;
  });
  return sortedQuestions;
};

/**
 * Fetches and populates a question or answer document based on the provided ID and type.
 *
 * @param {string | undefined} id - The ID of the question or answer to fetch.
 * @param {'question' | 'answer'} type - Specifies whether to fetch a question or an answer.
 *
 * @returns {Promise<QuestionResponse | AnswerResponse>} - Promise that resolves to the
 *          populated question or answer, or an error message if the operation fails
 */
export const populateDocument = async (
  id: string | undefined,
  type: 'question' | 'answer',
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!id) {
      throw new Error('Provided question ID is undefined.');
    }

    let result = null;

    if (type === 'question') {
      result = await QuestionModel.findOne({ _id: id }).populate([
        {
          path: 'tags',
          model: TagModel,
        },
        {
          path: 'answers',
          model: AnswerModel,
          populate: { path: 'comments', model: CommentModel },
        },
        { path: 'comments', model: CommentModel },
      ]);
    } else if (type === 'answer') {
      result = await AnswerModel.findOne({ _id: id }).populate([
        { path: 'comments', model: CommentModel },
      ]);
    }
    if (!result) {
      throw new Error(`Failed to fetch and populate a ${type}`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};

/**
 * Fetches a question by its ID and increments its view count.
 *
 * @param {string} qid - The ID of the question to fetch.
 * @param {string} username - The username of the user requesting the question.
 *
 * @returns {Promise<QuestionResponse | null>} - Promise that resolves to the fetched question
 *          with incremented views, null if the question is not found, or an error message.
 */
export const fetchAndIncrementQuestionViewsById = async (
  qid: string,
  username: string,
): Promise<QuestionResponse | null> => {
  try {
    const q = await QuestionModel.findOneAndUpdate(
      { _id: new ObjectId(qid) },
      { $addToSet: { views: username } },
      { new: true },
    ).populate([
      {
        path: 'tags',
        model: TagModel,
      },
      {
        path: 'answers',
        model: AnswerModel,
        populate: { path: 'comments', model: CommentModel },
      },
      { path: 'comments', model: CommentModel },
    ]);
    return q;
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Fetches answer by its ID
 *
 * @param {string} qid - The ID of the answer to fetch.
 * @param {string} username - The username of the user requesting the answer.
 *
 * @returns {Promise<AnswerResponse | null>} - Promise that resolves to the fetched answer
 *          ,null if the answer is not found, or an error message.
 */
export const fetchAnswerById = async (
  id: string,
  username: string,
): Promise<AnswerResponse | null> => {
  try {
    const a = await AnswerModel.findOne({ _id: new ObjectId(id) }).populate([
      { path: 'comments', model: CommentModel },
    ]);
    return a;
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Fetches a question draft by its ID
 *
 * @param {string} qid - The ID of the answer to fetch.
 * @param {string} username - The username of the user requesting the answer.
 *
 * @returns {Promise<AnswerResponse | null>} - Promise that resolves to the fetched answer
 *          ,null if the answer is not found, or an error message.
 */
export const fetchQuestionDraftById = async (
  id: string,
  username: string,
): Promise<DraftQuestionPayload | { error: string }> => {
  try {
    const draft = await DraftQuestionModel.findOne({ _id: new ObjectId(id) });
    if (draft) {
      const q = await QuestionModel.findOne({ _id: draft.editId }).populate([
        {
          path: 'tags',
          model: TagModel,
        },
        {
          path: 'answers',
          model: AnswerModel,
          populate: { path: 'comments', model: CommentModel },
        },
        { path: 'comments', model: CommentModel },
      ]);
      if (!q) return { error: 'did not find the drafts question' };

      const payload: DraftQuestionPayload = {
        _id: draft._id.toString(),
        username: draft.username,
        realId: draft.realId,
        editId: q,
      };
      return payload;
    }
    return { error: 'did not find the draft id' };
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Fetches a question draft by its ID
 *
 * @param {string} qid - The ID of the answer to fetch.
 * @param {string} username - The username of the user requesting the answer.
 *
 * @returns {Promise<AnswerResponse | null>} - Promise that resolves to the fetched answer
 *          ,null if the answer is not found, or an error message.
 */
export const fetchAnswerDraftById = async (
  id: string,
  username: string,
): Promise<DraftAnswerPayload | { error: string } | null> => {
  try {
    const draft = await DraftAnswerModel.findOne({ _id: new ObjectId(id) });
    if (draft) {
      const a = await AnswerModel.findOne({ _id: draft.editId }).populate([
        { path: 'comments', model: CommentModel },
      ]);

      if (!a) return { error: 'could not find associated id with the drafts answer' };

      const payload: DraftAnswerPayload = {
        _id: draft._id.toString(),
        qid: draft.qid,
        username: draft.username,
        realId: draft.realId,
        editId: a,
      };

      return payload;
    }

    return { error: 'did not find the draft id' };
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Fetches comments by its ID
 *
 * @param {string} qid - The ID of the comment to fetch.
 * @param {string} username - The username of the user requesting the comment.
 *
 * @returns {Promise<CommentResponse | null>} - Promise that resolves to the fetched comment
 *          ,null if the comment is not found, or an error message.
 */
export const fetchCommentById = async (
  id: string,
  username: string,
): Promise<CommentResponse | null> => {
  try {
    const c = await CommentModel.findOne({ _id: new ObjectId(id) });
    return c;
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Saves a new question to the database.
 *
 * @param {Question} question - The question to save
 *
 * @returns {Promise<QuestionResponse>} - The saved question, or error message
 */
export const saveQuestion = async (question: Question): Promise<QuestionResponse> => {
  try {
    const result = await QuestionModel.create(question);
    return result;
  } catch (error) {
    return { error: 'Error when saving a question' };
  }
};

/**
 * Saves a new answer to the database.
 *
 * @param {Answer} answer - The answer to save
 *
 * @returns {Promise<AnswerResponse>} - The saved answer, or an error message if the save failed
 */
export const saveAnswer = async (answer: Answer): Promise<AnswerResponse> => {
  try {
    const result = await AnswerModel.create(answer);
    return result;
  } catch (error) {
    return { error: 'Error when saving an answer' };
  }
};

/**
 * Saves a new comment to the database.
 *
 * @param {Comment} comment - The comment to save
 *
 * @returns {Promise<CommentResponse>} - The saved comment, or an error message if the save failed
 */
export const saveComment = async (comment: Comment): Promise<CommentResponse> => {
  try {
    const result = await CommentModel.create(comment);
    return result;
  } catch (error) {
    return { error: 'Error when saving a comment' };
  }
};

/**
 * Processes a list of tags by removing duplicates, checking for existing tags in the database,
 * and adding non-existing tags. Returns an array of the existing or newly added tags.
 * If an error occurs during the process, it is logged, and an empty array is returned.
 *
 * @param tags The array of Tag objects to be processed.
 *
 * @returns A Promise that resolves to an array of Tag objects.
 */
export const processTags = async (tags: Tag[]): Promise<Tag[]> => {
  try {
    // Extract unique tag names from the provided tags array using a Set to eliminate duplicates
    const uniqueTagNamesSet = new Set(tags.map(tag => tag.name));

    // Create an array of unique Tag objects by matching tag names
    const uniqueTags = [...uniqueTagNamesSet].map(
      name => tags.find(tag => tag.name === name)!, // The '!' ensures the Tag is found, assuming no undefined values
    );

    // Use Promise.all to asynchronously process each unique tag.
    const processedTags = await Promise.all(
      uniqueTags.map(async tag => {
        const existingTag = await TagModel.findOne({ name: tag.name });

        if (existingTag) {
          return existingTag; // If tag exists, return it as part of the processed tags
        }

        const addedTag = await addTag(tag);
        if (addedTag) {
          return addedTag; // If the tag does not exist, attempt to add it to the database
        }

        // Throwing an error if addTag fails
        throw new Error(`Error while adding tag: ${tag.name}`);
      }),
    );

    return processedTags;
  } catch (error: unknown) {
    // Log the error for debugging purposes
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.log('An error occurred while adding tags:', errorMessage);
    return [];
  }
};

/**
 * Adds a vote to a question.
 *
 * @param qid The ID of the question to add a vote to.
 * @param username The username of the user who voted.
 * @param type The type of vote to add, either 'upvote' or 'downvote'.
 *
 * @returns A Promise that resolves to an object containing either a success message or an error message,
 *          along with the updated upVotes and downVotes arrays.
 */
export const addVoteToQuestion = async (
  qid: string,
  username: string,
  type: 'upvote' | 'downvote',
): Promise<{ msg: string; upVotes: string[]; downVotes: string[] } | { error: string }> => {
  let updateOperation: QueryOptions;

  if (type === 'upvote') {
    updateOperation = [
      {
        $set: {
          upVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
              { $concatArrays: ['$upVotes', [username]] },
            ],
          },
          downVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              '$downVotes',
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
            ],
          },
        },
      },
    ];
  } else {
    updateOperation = [
      {
        $set: {
          downVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
              { $concatArrays: ['$downVotes', [username]] },
            ],
          },
          upVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              '$upVotes',
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
            ],
          },
        },
      },
    ];
  }

  try {
    const result = await QuestionModel.findOneAndUpdate({ _id: qid }, updateOperation, {
      new: true,
    });

    if (!result) {
      return { error: 'Question not found!' };
    }

    let msg = '';

    if (type === 'upvote') {
      msg = result.upVotes.includes(username)
        ? 'Question upvoted successfully'
        : 'Upvote cancelled successfully';
    } else {
      msg = result.downVotes.includes(username)
        ? 'Question downvoted successfully'
        : 'Downvote cancelled successfully';
    }

    return {
      msg,
      upVotes: result.upVotes || [],
      downVotes: result.downVotes || [],
    };
  } catch (err) {
    return {
      error:
        type === 'upvote'
          ? 'Error when adding upvote to question'
          : 'Error when adding downvote to question',
    };
  }
};

/**
 * Adds an answer to a question.
 *
 * @param {string} qid - The ID of the question to add an answer to
 * @param {Answer} ans - The answer to add
 *
 * @returns Promise<QuestionResponse> - The updated question or an error message
 */
export const addAnswerToQuestion = async (qid: string, ans: Answer): Promise<QuestionResponse> => {
  try {
    if (!ans || !ans.text || !ans.ansBy || !ans.ansDateTime) {
      throw new Error('Invalid answer');
    }
    const parent = await QuestionModel.findOne({ _id: qid });
    if (parent?.locked) {
      throw new Error('Cannot add answers on locked questions');
    }
    const result = await QuestionModel.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [ans._id], $position: 0 } } },
      { new: true },
    );
    if (result === null) {
      throw new Error('Error when adding answer to question');
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding answer to question' };
  }
};

/**
 * Adds a comment to a question or answer.
 *
 * @param id The ID of the question or answer to add a comment to
 * @param type The type of the comment, either 'question' or 'answer'
 * @param comment The comment to add
 *
 * @returns A Promise that resolves to the updated question or answer, or an error message if the operation fails
 */
export const addComment = async (
  id: string,
  type: 'question' | 'answer',
  comment: Comment,
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!comment || !comment.text || !comment.commentBy || !comment.commentDateTime) {
      throw new Error('Invalid comment');
    }
    let result: QuestionResponse | AnswerResponse | null;
    if (type === 'question') {
      const parent = await QuestionModel.findOne({ _id: id });
      if (parent?.locked) {
        throw new Error('Cannot comment on a locked post');
      }
      result = await QuestionModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    } else {
      const parent = await AnswerModel.findOne({ _id: id });
      if (parent?.locked) {
        throw new Error('Cannot comment on a locked post');
      }
      result = await AnswerModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    }
    if (result === null) {
      throw new Error('Failed to add comment');
    }
    return result;
  } catch (error) {
    return { error: `Error when adding comment: ${(error as Error).message}` };
  }
};

/**
 * Gets a map of tags and their corresponding question counts.
 *
 * @returns {Promise<Map<string, number> | null | { error: string }>} - A map of tags to their
 *          counts, `null` if there are no tags in the database, or the error message.
 */
export const getTagCountMap = async (): Promise<Map<string, number> | null | { error: string }> => {
  try {
    const tlist = await TagModel.find();
    const qlist = await QuestionModel.find().populate({
      path: 'tags',
      model: TagModel,
    });

    if (!tlist || tlist.length === 0) {
      return null;
    }

    const tmap = new Map(tlist.map(t => [t.name, 0]));

    if (qlist != null && qlist !== undefined && qlist.length > 0) {
      qlist.forEach(q => {
        q.tags.forEach(t => {
          tmap.set(t.name, (tmap.get(t.name) || 0) + 1);
        });
      });
    }

    return tmap;
  } catch (error) {
    return { error: 'Error when construction tag map' };
  }
};

/**
 * gets an account from the database with a matching username and password
 *
 * @param username the username of the account being logged into
 * @param password the password of the account being logged into
 * @returns {Promise<AccountResponse>}  - either the account logged into or an error message describing what failed
 */
export const loginToAccount = async (
  username: string,
  password: string,
): Promise<AccountResponse> => {
  try {
    const account = await AccountModel.findOne({ username });

    if (!account) {
      throw new Error('Account does not exist');
    }

    if (account.hashedPassword !== password) {
      throw new Error('Incorrect password');
    }

    return account;
  } catch (error) {
    return { error: `Error accessing account: ${(error as Error).message}` };
  }
};

/**
 * attempts to create and save an account onto the server if the account does not already exist
 *
 * @param account the account being created
 * @returns {Promise<AccountResponse>} either the created account, or an error message about the failure that occured
 */
export const createAccount = async (account: Account): Promise<AccountResponse> => {
  try {
    const existingAccount = await AccountModel.findOne({ username: account.username });

    if (existingAccount) {
      throw new Error('Account with matching username already exists');
    }

    const existingEmailAccount = await AccountModel.findOne({ email: account.email });

    if (existingEmailAccount) {
      throw new Error('Account with matching email already exists');
    }

    // default initialization for a new account
    account.score = 0;
    account.dateCreated = new Date();
    account.questions = [];
    account.answers = [];
    account.comments = [];
    account.upVotedQuestions = [];
    account.upvotedAnswers = [];
    account.downvotedQuestions = [];
    account.downvotedAnswers = [];
    account.questionDrafts = [];
    account.answerDrafts = [];
    account.userType = 'user';

    const newAccount = await AccountModel.create(account);

    return newAccount;
  } catch (error) {
    return { error: `Error creating account: ${(error as Error).message}` };
  }
};

/**
 * Updates the settings of an account in the database.
 *
 * @param accountId The ID of the account to update.
 * @param settings The settings object to update.
 *
 * @returns The updated account object.
 * @throws Error if the account does not exist or the update fails.
 */
export const updateAccountSettings = async (
  accountId: string,
  settings: Account['settings'],
): Promise<Account> => {
  try {
    const account = await AccountModel.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    // Update the settings field in the database
    await AccountModel.findOneAndUpdate({ _id: accountId }, { $set: { settings } });

    // Return the updated account object
    return {
      ...account,
      settings: {
        ...account.settings,
        ...settings,
      },
    };
  } catch (err) {
    throw new Error(`Failed to update account settings: ${(err as Error).message}`);
  }
};

export const getAccounts = async (): Promise<Account[]> => {
  try {
    const accounts = await AccountModel.find();
    return accounts;
  } catch (error) {
    throw new Error('Failed to fetch accounts');
  }
};

export const updateUserType = async (userID: string, userType: string): Promise<Account> => {
  try {
    console.log('userID:', userID);
    const user = await AccountModel.findById(userID);

    if (!user) {
      throw new Error('Account not found');
    }
    console.log('user:', user);
    console.log('userType:', userType);
    console.log('userID:', userID);
    const account = await AccountModel.findOneAndUpdate(
      { _id: userID },
      { $set: { userType } },
      { new: true },
    );

    if (!account) {
      throw new Error('Account not found');
    }

    return account;
  } catch (error) {
    throw new Error(`Failed to update user type: ${error}`);
  }
};

/**
 * checks if a user has the ability to perform moderator actions
 * @param account the account of the user requesting to take the action
 * @returns true if the user is a moderator, and false if the user
 */
export const canPerformActions = async (account: Account): Promise<boolean> | never => {
  try {
    const existingAccount = await AccountModel.findOne({
      username: account.username,
      hashedPassword: account.hashedPassword,
    });

    return (
      !!existingAccount &&
      (existingAccount.userType === 'moderator' || existingAccount.userType === 'owner')
    );
  } catch (error) {
    throw new Error('Error when determining if user has moderator permissions');
  }
};

/*
 * Pins or unpins a post (question, answer, or comment) in the database.
 *
 * @param {string} postType - The type of the post to pin or unpin.
 * @param {string} postID - The ID of the post to pin or unpin.
 *
 * @returns {Promise<ActionResponse>} - The updated post or an error message if the operation fails.
 */
export const pinPost = async (
  postType: string,
  postID: string,
  parentID: string | undefined,
  parentType: string | undefined,
): Promise<ActionResponse> => {
  try {
    let result: QuestionResponse | AnswerResponse | CommentResponse | null;
    if (postType === 'question') {
      const q = await QuestionModel.findOne({ _id: postID });

      result = await QuestionModel.findOneAndUpdate(
        { _id: postID },
        { $set: { pinned: !q?.pinned } },
        { new: true },
      );

      if (result && q) {
        return { question: result };
      }
    } else if (postType === 'answer') {
      const a = await AnswerModel.findOne({ _id: postID });

      result = await AnswerModel.findOneAndUpdate(
        { _id: postID },
        { $set: { pinned: !a?.pinned } },
        { new: true },
      );

      if (result && a) {
        return { answer: result };
      }
    } else {
      const c = await CommentModel.findOne({ _id: postID });

      result = await CommentModel.findOneAndUpdate(
        { _id: postID },
        { $set: { pinned: !c?.pinned } },
        { new: true },
      );

      if (result && c) {
        return { comment: result };
      }
    }

    return result || { error: 'lock action failed' };
  } catch (error) {
    return { error: 'lock action failed' };
  }
};

/*
 * removes a post (question, answer, or comment) in the database.
 *
 * @param {string} postType - The type of the post to edit.
 * @param {string} postID - The ID of the post to edit.
 * @param {string} newText - The new text to replace the existing text.
 *
 * @returns {Promise<ActionResponse>} - The deleted post or an error message if the operation fails.
 */
export const removePost = async (
  postType: string,
  postID: string,
  parentID: string | undefined,
  parentType: string | undefined,
): Promise<ActionResponse> => {
  try {
    if (postType === 'question') {
      const result = await QuestionModel.findOneAndDelete({ _id: postID });
      return { question: result };
    }
    if (postType === 'answer') {
      // parent = QuestionModel.findOne where postID in answer
      const parent = await QuestionModel.findOne({ _id: parentID });
      if (!parent) {
        throw new Error(`invalid parentid${parentID}`);
      }
      // eslint-disable-next-line array-callback-return
      const answers = parent.answers.filter(a => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        a._id?.toString() !== postID;
      });

      await QuestionModel.findOneAndUpdate({ _id: postID }, { $set: { answers } }, { new: true });

      const result = await AnswerModel.findOneAndDelete({ _id: postID });
      return { answer: result };
    }
    // parent = AnswerModel.findOne where postID in answer
    if (parentType === 'question') {
      const parent = await QuestionModel.findOne({ _id: parentID });
      if (!parent) {
        throw new Error('invalid parentid');
      }
      // eslint-disable-next-line array-callback-return
      const comments = parent.comments.filter(c => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        c._id?.toString() !== postID;
      });

      await QuestionModel.findOneAndUpdate({ _id: postID }, { $set: { comments } }, { new: true });

      const result = await CommentModel.findOneAndDelete({ _id: postID });
      return { comment: result };
    }
    const parent = await AnswerModel.findOne({ _id: parentID });
    if (!parent) {
      throw new Error('invalid parentid');
    }
    // eslint-disable-next-line array-callback-return
    const comments = parent.comments.filter(c => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      c._id?.toString() !== postID;
    });

    await AnswerModel.findOneAndUpdate({ _id: postID }, { $set: { comments } }, { new: true });

    const result = await CommentModel.findOneAndDelete({ _id: postID });
    return { comment: result };
  } catch (error) {
    return { error: 'remove action failed' };
  }
};

/*
 * Locks or unlocks a question or answer.
 *
 * @param {string} postType - The type of the post to lock or unlock.
 * @param {string} postID - The ID of the post to lock or unlock.
 *
 * @returns {Promise<ActionResponse>} - The updated post or an error message if the operation fails.
 */
export const lockPost = async (postType: string, postID: string): Promise<ActionResponse> => {
  if (postType === 'comment') {
    return {};
  }

  try {
    let result: QuestionResponse | AnswerResponse | null;
    if (postType === 'question') {
      const q = await QuestionModel.findOne({ _id: postID });

      result = await QuestionModel.findOneAndUpdate(
        { _id: postID },
        { $set: { locked: !q?.locked } },
        { new: true },
      );

      if (result && q) {
        return { question: result };
      }
    } else {
      const a = await AnswerModel.findOne({ _id: postID });
      result = await AnswerModel.findOneAndUpdate(
        { _id: postID },
        { $set: { locked: !a?.locked } },
        { new: true },
      );

      if (result && a) {
        return { answer: result };
      }
    }

    return result || { error: 'lock action failed' };
  } catch (error) {
    return { error: 'lock action failed' };
  }
};

/*
 * Marks an answer as correct or incorrect.
 *
 * @param {string} aID - The ID of the answer to mark.
 * @param {boolean} correct - `true` to mark the answer as correct, `false` to mark it as incorrect.
 *
 * @returns {Promise<ActionResponse>} - The updated answer or an error message if the operation fails.
 */
export const markAnswerCorrect = async (aID: string, correct: boolean): Promise<Answer | Error> => {
  try {
    const a = await AnswerModel.findOne({ _id: aID });

    const result = await AnswerModel.findOneAndUpdate(
      { _id: aID },
      { $set: { isCorrect: correct } },
      { new: true },
    );

    if (result && a) {
      return result;
    }
    return new Error('mark correct action failed');
  } catch {
    throw new Error('mark correct action failed');
  }
};

export const getAccount = async (userName: string): Promise<Account> => {
  const account = await AccountModel.findOne({ username: userName });
  if (!account) {
    throw new Error('Account not found');
  }
  return account;
};

export const findUserTags = async (tags: Tag[] | ObjectId[]): Promise<Tag[]> => {
  const tagObjs: Tag[] = [];
  for (const tag of tags) {
    // eslint-disable-next-line no-await-in-loop
    const t = await TagModel.findOne({ _id: tag._id });
    if (t) tagObjs.push(t);
  }
  return tagObjs;
};

export const findUsersQuestions = async (username: string): Promise<Question[]> => {
  const data = await QuestionModel.find({ askedBy: username });
  const questions: Question[] = [];
  for (const item of data) {
    // eslint-disable-next-line no-await-in-loop
    const q = await QuestionModel.findOne({ _id: item._id });
    if (q && !q.draft) {
      // eslint-disable-next-line no-await-in-loop
      q.tags = await findUserTags(q.tags);
      questions.push(q);
    }
  }
  return questions;
};

export const findUsersAnswers = async (username: string): Promise<Answer[]> => {
  const data = await AnswerModel.find({ ansBy: username });
  const answers: Answer[] = [];
  for (const item of data) {
    // eslint-disable-next-line no-await-in-loop
    const a = await AnswerModel.findOne({ _id: item._id });
    if (a && !a.draft) answers.push(a);
  }
  return answers;
};

export const findUsersComments = async (username: string): Promise<Comment[]> => {
  const data = await CommentModel.find({ commentBy: username });
  const comments: Comment[] = [];
  for (const item of data) {
    // eslint-disable-next-line no-await-in-loop
    const c = await CommentModel.findOne({ _id: item._id });
    if (c) comments.push(c);
  }
  return comments;
};

export const getUserScore = async (username: string): Promise<number> => {
  const profile = await AccountModel.findOne({ username });
  if (!profile) return 0;
  return profile.score;
};

export const findUsersAnswersDrafts = async (username: string): Promise<DraftAnswerPayload[]> => {
  const data = await DraftAnswerModel.find({ username });
  const answers: DraftAnswerPayload[] = [];
  for (const item of data) {
    // eslint-disable-next-line no-await-in-loop
    const a = await DraftAnswerModel.findOne({ _id: item._id });
    if (a) {
      // eslint-disable-next-line no-await-in-loop
      const editA = await AnswerModel.findOne({ _id: a.editId }).populate([
        { path: 'comments', model: CommentModel },
      ]);
      if (editA) {
        const payload: DraftAnswerPayload = {
          _id: item._id.toString(),
          username: a.username,
          realId: a.realId,
          qid: a.qid,
          editId: editA,
        };
        answers.push(payload);
      }
    }
  }
  return answers;
};

export const findUsersQuestionDrafts = async (
  username: string,
): Promise<DraftQuestionPayload[]> => {
  const data = await DraftQuestionModel.find({ username });
  const questions: DraftQuestionPayload[] = [];
  for (const item of data) {
    // eslint-disable-next-line no-await-in-loop
    const q = await DraftQuestionModel.findOne({ _id: item._id });
    if (q) {
      // eslint-disable-next-line no-await-in-loop
      const editQ = await QuestionModel.findOne({ _id: q.editId }).populate([
        {
          path: 'tags',
          model: TagModel,
        },
        {
          path: 'answers',
          model: AnswerModel,
          populate: { path: 'comments', model: CommentModel },
        },
        { path: 'comments', model: CommentModel },
      ]);

      if (editQ) {
        const payload: DraftQuestionPayload = {
          _id: item._id.toString(),
          username: q.username,
          realId: q.realId,
          editId: editQ,
        };
        questions.push(payload);
      }
    }
  }
  return questions;
};

export const checkIfExists = async (id: string, type: string): Promise<boolean> => {
  if (type === 'question') {
    const q = await DraftQuestionModel.findOne({ _id: id });
    return !!q;
  }
  if (type === 'answer') {
    const a = await DraftAnswerModel.findOne({ _id: id });
    return !!a;
  }
  if (type === 'comment') {
    return true;
  }
  return false;
};

export const updateQuestion = async (question: Question): Promise<void> => {
  const tags = [];
  for (const tag of question.tags) {
    // eslint-disable-next-line no-await-in-loop
    const t = await addTag(tag);
    // eslint-disable-next-line no-continue
    if (!t) continue;
    // eslint-disable-next-line no-await-in-loop
    const modelTag = await TagModel.findOne({ name: t.name });
    if (modelTag) tags.push(modelTag);
  }

  const q = await QuestionModel.findOneAndUpdate(
    { _id: question._id },
    {
      $set: {
        title: question.title,
        text: question.text,
        tags,
        presetTags: question.presetTags,
      },
    },
  );
  if (!q) throw new Error(`Could not find the question ${question._id} to update`);
};

export const updateAnswer = async (answer: Answer): Promise<void> => {
  const a = await AnswerModel.findOneAndUpdate(
    { _id: answer._id },
    { $set: { text: answer.text } },
  );
  if (!a) throw new Error(`Could not find the answer ${answer._id} to update`);
};

export const updateComment = async (comment: Comment): Promise<void> => {
  const c = await CommentModel.findOneAndUpdate(
    { _id: comment._id },
    { $set: { text: comment.text } },
  );
  if (!c) throw new Error(`Could not find the comment ${comment._id} to update`);
};

export const saveQuestionDraft = async (
  username: string,
  question: Question,
): Promise<DraftQuestion> => {
  const realQuestion = await QuestionModel.findOne({ _id: question._id });
  question.draft = true;
  question._id = undefined;
  const draftQ = await QuestionModel.create(question);

  await DraftQuestionModel.deleteMany({ editId: draftQ._id });

  let draft: DraftQuestion;
  if (realQuestion) {
    await DraftQuestionModel.deleteMany({ realId: realQuestion._id });
    draft = {
      username,
      realId: realQuestion?._id.toString(),
      editId: draftQ._id.toString(),
    };
  } else {
    draft = {
      username,
      editId: draftQ._id.toString(),
    };
  }

  const draftQuestion = await DraftQuestionModel.create(draft);

  return draftQuestion;
};

export const saveQuestionFromDraft = async (newDraftQ: Question): Promise<void> => {
  if (newDraftQ._id) {
    await QuestionModel.findOneAndUpdate(
      { _id: newDraftQ._id },
      {
        $set: {
          text: newDraftQ.text,
          title: newDraftQ.title,
          tags: newDraftQ.tags,
          presetTags: newDraftQ.presetTags,
        },
      },
      { new: true },
    );
  }
};

export const saveAnswerFromDraft = async (answer: Answer): Promise<void> => {
  if (answer._id) {
    await AnswerModel.findOneAndUpdate(
      { _id: answer._id },
      { $set: { text: answer.text } },
      { new: true },
    );
  }
};

export const saveAnswerDraft = async (
  username: string,
  answer: Answer,
  qid: string,
): Promise<DraftAnswer> => {
  const realAnswer = await AnswerModel.findOne({ _id: answer._id });
  answer.draft = true;
  answer._id = undefined;
  const draftA = await AnswerModel.create(answer);

  if (!draftA) {
    throw new Error(`Could not create a answer that is being saved as a draft`);
  }

  // overwrite existing drafts for the same answer
  await DraftAnswerModel.deleteMany({ editId: draftA._id });

  let draft: DraftAnswer;
  if (realAnswer) {
    await DraftAnswerModel.deleteMany({ realId: realAnswer._id });
    draft = {
      username,
      realId: realAnswer._id.toString(),
      qid,
      editId: draftA._id.toString(),
    };
  } else {
    draft = {
      username,
      qid,
      editId: draftA._id.toString(),
    };
  }

  const draftAnswer = await DraftAnswerModel.create(draft);

  return draftAnswer;
};

export const removeOriginalDraftQuestion = async (realId: string): Promise<void> => {
  await QuestionModel.deleteOne({ _id: realId });
};

export const removeOriginalDraftAnswer = async (realId: string): Promise<void> => {
  await AnswerModel.deleteOne({ _id: realId });
};

export const removeAnswerDraft = async (ans: Answer): Promise<void> => {
  await DraftAnswerModel.deleteMany({ editId: ans._id });
};

export const removeQuestionDraft = async (question: Question): Promise<void> => {
  await DraftQuestionModel.deleteMany({ editId: question._id });
};
