import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Account collection.
 *
 * This schema defines the structure for storing accounts in the database.
 * Each account includes the following fields:
 * - `username`: The username of the account
 * - `email`: the email associated with the account
 * - `hashedPassword`: The password of the account stored in a hash
 * - `score`: The score of the account
 * - `dateCreated`: The date and time when the account was created
 * - `questions`: The questions asked by the user
 * - `answers`: The answers provided by the user
 * - `comments`: The comments made by the user
 * - `upVotedQuestions`: The questions upvoted by the user
 * - `upvotedAnswers`: The answers upvoted by the user
 * - `downvotedQuestions`: The questions downvoted by the user
 * - `downvotedAnswers`: The answers downvoted by the user
 * - `questionDrafts`: The question drafts created by the user
 * - `answerDrafts`: The answer drafts created by the user
 * - `settings`: The accessibility settings of the user
 */
const accountSchema: Schema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    hashedPassword: {
      type: String,
    },
    userType: {
      type: String,
      enum: ['user', 'moderator', 'owner'],
    },
    score: {
      type: Number,
    },
    dateCreated: {
      type: Date,
    },
    questions: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    },
    answers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    },
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    },
    upVotedQuestions: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    },
    upvotedAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    },
    downvotedQuestions: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    },
    downvotedAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    },
    questionDrafts: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    },
    answerDrafts: {
      type: [
        {
          key: { type: Schema.Types.ObjectId, ref: 'Answer' },
          value: { type: Schema.Types.ObjectId, ref: 'Question' },
        },
      ],
    },
    settings: {
      theme: {
        type: String,
        enum: [
          'light',
          'dark',
          'northeastern, oceanic, highContrast, colorblindFriendly, greyscale',
        ],
      },
      textSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
      },
      screenReader: Boolean,
    },
  },
  { collection: 'Account' },
);

export default accountSchema;
