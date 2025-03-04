import { Socket } from 'socket.io-client';

export type FakeSOSocket = Socket<ServerToClientEvents>;

/**
 * Represents a user in the application.
 */
export interface User {
  username: string;
  hashedPassword: string;
  email: string;
  userType: 'user' | 'moderator' | 'owner';
}

/**
 * Enum representing the possible ordering options for questions.
 * and their display names.
 */
export const orderTypeDisplayName = {
  newest: 'Newest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
} as const;

/**
 * Type representing the keys of the orderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type OrderType = keyof typeof orderTypeDisplayName;

/**
 * Interface represents a comment.
 *
 * text - The text of the comment.
 * commentBy - Username of the author of the comment.
 * commentDateTime - Time at which the comment was created.
 * pinned - A boolean indicating whether the comment is pinned.
 */
export interface Comment {
  _id?: string;
  text: string;
  commentBy: string;
  commentDateTime: Date;
  pinned: boolean;
}

/**
 * Interface representing a tag associated with a question.
 *
 * @property name - The name of the tag.
 * @property description - A description of the tag.
 */
export interface Tag {
  _id?: string;
  name: string;
  description: string;
}

/**
 * Interface represents the data for a tag.
 *
 * name - The name of the tag.
 * qcnt - The number of questions associated with the tag.
 */
export interface TagData {
  name: string;
  qcnt: number;
}

/**
 * Interface representing the voting data for a question, which contains:
 * - qid - The ID of the question being voted on
 * - upVotes - An array of user IDs who upvoted the question
 * - downVotes - An array of user IDs who downvoted the question
 */
export interface VoteData {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Comments associated with the answer.
 * - pinned - A boolean indicating whether the answer is pinned
 * - locked - A boolean indicating whether the answer is locked
 * - isCorrect - A boolean indicating whether the answer is correct
 */
export interface Answer {
  _id?: string;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[];
  pinned: boolean;
  locked: boolean;
  isCorrect: boolean;
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
 * Interface representing the structure of a Question object.
 *
 * - _id - The unique identifier for the question.
 * - tags - An array of tags associated with the question, each containing a name and description.
 * - answers - An array of answers to the question
 * - title - The title of the question.
 * - views - An array of usernames who viewed the question.
 * - text - The content of the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - The date and time when the question was asked.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 * - comments - Comments associated with the question.
 * - pinned - A boolean indicating whether the question is pinned.
 * - locked - A boolean indicating whether the question is locked.
 * - presetTags - An array of preset tag names associated with the question.
 */
export interface Question {
  _id?: string;
  tags: Tag[];
  answers: Answer[];
  title: string;
  views: string[];
  text: string;
  askedBy: string;
  askDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[];
  pinned: boolean;
  locked: boolean;
  presetTags: PresetTagName[];
}

/**
 * Interface representing an account in the application.
 * - _id - The unique identifier for the account.
 * - username - The username of the account.
 * - email - The email address of the account.
 * - hashedPassword - The hashed password of the account.
 * - score - The score of the account.
 * - dateCreated - The date the account was created.
 * - questions - An array of questions asked by the account.
 * - answers - An array of answers provided by the account.
 * - comments - An array of comments made by the account.
 * - upVotedQuestions - An array of questions upvoted by the account.
 * - upvotedAnswers - An array of answers upvoted by the account.
 * - downvotedQuestions - An array of questions downvoted by the account.
 * - downvotedAnswers - An array of answers downvoted by the account.
 * - questionDrafts - An array of question drafts created by the account.
 * - answerDrafts - An array of answer drafts created by the account.
 * - settings - The accessibility settings of the account.
 */
export interface Account {
  _id?: string;
  username: string;
  email: string;
  userType: 'user' | 'moderator' | 'owner';
  hashedPassword: string;
  score: number;
  dateCreated: Date;
  questions: Question[];
  answers: Answer[];
  comments: Comment[];
  upVotedQuestions: Question[];
  upvotedAnswers: Answer[];
  downvotedQuestions: Question[];
  downvotedAnswers: Answer[];
  questionDrafts: Question[];
  answerDrafts: Answer[];
  settings: {
    theme:
      | 'light'
      | 'dark'
      | 'northeastern'
      | 'oceanic'
      | 'highContrast'
      | 'colorblindFriendly'
      | 'greyscale';
    textSize: 'small' | 'medium' | 'large';
    screenReader: boolean;
  };
}

/**
 * Interface representing the payload for a vote update socket event.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

export interface AnswerUpdatePayload {
  qid: string;
  answer: Answer;
  removed: boolean;
}

export interface CommentUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
}

export interface QuestionUpdatePayload {
  quest: Question;
  removed: boolean;
}

export interface ProfilePagePayload {
  username: string;
  score: number;
  questions: Question[];
  answers: Answer[];
  comments: Comment[];
  answerDrafts: DraftAnswer[];
  questionDrafts: DraftQuestion[];
}

export interface DraftQuestion {
  _id: string;
  username: string;
  realId: string;
  editId: Question;
}

export interface DraftAnswer {
  _id: string;
  username: string;
  realId: string;
  qid: string;
  editId: Answer;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (update: QuestionUpdatePayload) => void;
  answerUpdate: (update: AnswerUpdatePayload) => void;
  viewsUpdate: (question: Question) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (update: CommentUpdatePayload) => void;
  darkModeUpdate: (mode: boolean) => void;
  userUpdate: (profile: ProfilePagePayload) => void;
  answerCorrectUpdate: (ans: Answer) => void;
}
