import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ServerToClientEvents>;

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed';

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Object IDs of comments that have been added to the answer by users, or comments themselves if populated
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[] | ObjectId[];
  locked: boolean;
  pinned: boolean;
  draft: boolean;
  isCorrect: boolean;
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
  description: string;
}

/**
 * Interface representing a PresetTag, which contains:
 * - name - The name of the tag.
 */
export type PresetTagName =
  | 'C'
  | 'C++'
  | 'Java'
  | 'Python'
  | 'JavaScript'
  | 'HTML'
  | 'CSS'
  | 'SQL'
  | 'MongoDB'
  | 'React'
  | 'Angular'
  | 'Node.js'
  | 'OOD'
  | 'SWE'
  | 'Algorithms'
  | 'Data Structures'
  | 'Testing'
  | 'Debugging'
  | 'Version Control'
  | 'Security'
  | 'Web Development'
  | 'Mobile Development'
  | 'Cloud Computing'
  | 'DevOps'
  | 'Agile'
  | 'Scrum'
  | 'Kanban'
  | 'CI/CD'
  | 'Docker'
  | 'Kubernetes'
  | 'Microservices'
  | 'Serverless'
  | 'RESTful APIs'
  | 'GraphQL'
  | 'WebSockets'
  | 'OAuth'
  | 'JWT'
  | 'Cookies'
  | 'Sessions'
  | 'SQL Injection'
  | 'Buffer Overflows'
  | 'Markdown'
  | 'Latex';

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - he date and time when the question was asked.
 * - answers - Object IDs of answers that have been added to the question by users, or answers themselves if populated.
 * - views - An array of usernames that have viewed the question.
 * - upVotes - An array of usernames that have upvoted the question.
 * - downVotes - An array of usernames that have downvoted the question.
 * - comments - Object IDs of comments that have been added to the question by users, or comments themselves if populated.
 * - presetTags - An array of preset tags that can be associated with the question.
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  askedBy: string;
  askDateTime: Date;
  answers: Answer[] | ObjectId[];
  views: string[];
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
  locked: boolean;
  pinned: boolean;
  draft: boolean;
  presetTags: PresetTagName[];
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The username of the user who asked the question
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
    askedBy: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindDraftByIdRequest extends Request {
  params: {
    id: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request parameters when finding a answer by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindAnswerByIdRequest extends Request {
  params: {
    id: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request parameters when finding a comment by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindCommentByIdRequest extends Request {
  params: {
    id: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - body - The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the username of the user voting.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user voting.
 */
export interface VoteRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}

export interface UpdateSettingRequest {
  body: {
    theme: 'light' | 'dark' | 'northeastern' | 'oceanic' | 'highContrast' | 'colorblindFriendly' | 'greyscale';        // Whether dark mode is enabled or not
    textSize: 'small' | 'medium' | 'large';  // The preferred text size
    screenReader: boolean;    // Whether screen reader mode is enabled
  };
}

/**
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The username of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 *
 */
export interface Comment {
  _id?: ObjectId;
  text: string;
  commentBy: string;
  commentDateTime: Date;
  pinned: boolean;
}

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
export interface AddCommentRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    comment: Comment;
  };
}

/**
 * Type representing the possible responses for a Comment-related operation.
 */
export type CommentResponse = Comment | { error: string };

/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: AnswerResponse | QuestionResponse | null;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a vote update event, which contains:
 * - qid - The unique identifier of the question.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update event, which contains:
 * - qid - The unique identifier of the question.
 * - answer - The updated answer.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: AnswerResponse;
  removed: boolean;
}

/**
 * Interface representing the payload for an question update event, which contains:
 * - question - The quesiton
 * - removed - if its being removed
 */
export interface QuestionUpdatePayload {
  quest: Question;
  removed: boolean;
}

/**
 * interface representing the accessibility settings of a user, which contains:
 * - darkMode - A boolean indicating whether the user prefers dark mode
 * - textSize - The preferred text size of the user
 * - screenReader - A boolean indicating whether the user prefers screen reader
 */
export interface AccessibilitySettings {
  darkMode: boolean;
  textSize: 'small' | 'medium' | 'large';
  screenReader: boolean;
}

/**
 * interface representing the accessibility settings of a user, which contains:
 * - darkMode - A boolean indicating whether the user prefers dark mode
 * - textSize - The preferred text size of the user
 * - screenReader - A boolean indicating whether the user prefers screen reader
 */
export interface AccessibilitySettings {
  darkMode: boolean;
  textSize: 'small' | 'medium' | 'large';
  screenReader: boolean;
}

/**
 * Interface representing a User's Account, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - username - The username of the account
 * - email - the email of the account
 * - hashedPassword - The securely hashed password of the account
 * - score - The score of the account
 * - dateCreated - The date and time when the account was created
 * - questions - Object IDs of questions that have been asked by the user
 * - answers - Object IDs of answers that have been added by the user
 * - comments - Object IDs of comments that have been added by the user
 * - upVotedQuestions - Object IDs of questions that have been upvoted by the user
 * - upvotedAnswers - Object IDs of answers that have been upvoted by the user
 * - downvotedQuestions - Object IDs of questions that have been downvoted by the user
 * - downvotedAnswers - Object IDs of answers that have been downvoted by the user
 * - questionDrafts - Object IDs of questions that have been saved as drafts by the user
 * - answerDrafts - Object IDs of answers that have been saved as drafts by the user, mapped to the qid they will be added to
 * - settings - The accessibility settings of the user

 */
export interface Account {
  _id?: ObjectId;
  username: string;
  email: string;
  hashedPassword: string;
  userType: 'user' | 'moderator' | 'owner';
  score: number;
  dateCreated: Date;
  questions: Question[] | ObjectId[];
  answers: Answer[] | ObjectId[];
  comments: Comment[] | ObjectId[];
  upVotedQuestions: Question[] | ObjectId[];
  upvotedAnswers: Answer[] | ObjectId[];
  downvotedQuestions: Question[] | ObjectId[];
  downvotedAnswers: Answer[] | ObjectId[];
  questionDrafts: Question[] | ObjectId[];
  answerDrafts: Answer[] | ObjectId[];
  settings: {theme: 'light' | 'dark' | 'northeastern' | 'oceanic' | 'highContrast' | 'colorblindFriendly' | 'greyscale';
    textSize: 'small' | 'medium' | 'large';
    screenReader: boolean;};
}

/**
 * Interface extending the request body when trying to log into an account, which contains:
 * - username - The username of the account being logged into
 * - hashedPassword - The password guess for the account
 */
export interface LoginRequest extends Request {
  body: {
    username: string;
    hashedPassword: string;
  };
}

/**
 * Interface extending the request body when trying to create a new account, which contains:
 * - body - The new account that will be added into the database if possible
 */
export interface CreateAccountRequest extends Request {
  body: Account;
}

export interface GetUserDataRequest extends Request {
  body: {
    profile: Account;
  };
}

export type ActionTypes = 'pin' | 'remove' | 'lock' | 'promote';

/**
 * Type representing the possible responses for an Account-related operation.
 */
export type AccountResponse = Account | { error: string };

/**
 * Interface extending the request body when trying to create a new account, which contains:
 * - user - the user attempting to take the actions on a post
 * - actionType - the type of moderator action being taken
 * - postType - the type of the post that is being actioned
 * - postID - the objectID of the post
 */
export interface ActionRequest extends Request {
  body: {
    user: Account;
    actionType: ActionTypes;
    postType: 'question' | 'answer' | 'comment';
    postID: string;
    parentPostType?: 'question' | 'answer' | 'comment';
    parentID?: string;
  }
}

/**
 * Type representing the possible responses for an action
 */
export type ActionResponse = {} | { comment: Comment} | { answer: Answer} | { question: Question } | { error: string }

export interface ProfilePagePayload {
  username: string;
  score: number;
  questions: Question[];
  answers: Answer[];
  comments: Comment[];
  answerDrafts: DraftAnswerPayload[];
  questionDrafts: DraftQuestionPayload[];
}

export interface SaveQuestionAsDraftRequest extends Request {
  body: {
    draft: Question;
    username: string;
  };
}

export interface DraftQuestionRequest extends Request {
  body: {
    draftQuestion: Question;
    realId: string;
    username: string;
  };
}

export interface DraftAnswerRequest extends Request {
  body: {
    draftAnswer: Answer;
    qid: string;
    realId: string;
    username: string;
  };
}

export interface SaveAnswerAsDraftRequest extends Request {
  body: {
    draft: Answer;
    qid: string;
    username: string;
  };
}

export interface DraftQuestion {
  _id?: ObjectId;
  username: string;
  realId?: string;
  editId: string;
}

export interface DraftQuestionPayload {
  _id: string;
  username: string;
  realId?: string;
  editId: Question;
}

export interface DraftAnswer {
  _id?: ObjectId;
  username: string;
  realId?: string;
  qid: string;
  editId: string;
}

export interface DraftAnswerPayload {
  _id: string
  username: string;
  realId?: string;
  qid: string;
  editId: Answer;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionUpdatePayload) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
  darkModeUpdate: (mode: boolean) => void;
  userUpdate: (profile: ProfilePagePayload) => void;
  answerCorrectUpdate: (ans: Answer) => void;
}
