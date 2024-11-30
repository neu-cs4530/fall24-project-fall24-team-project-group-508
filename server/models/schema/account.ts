import { Schema } from 'mongoose';

/**
 * Mongoose schema for the settings.
 *
 * This schema defines the structure for storing settings
 * Each setting includes the following fields:
 * - `textSize`: The current text size (small, medium, large)
 * - `darkMode`: the current dark mode setting
 * - `highContrast`: The current high contrast setting
 * - `screenReader`: The current screen reader setting
 */
const accessibilitySettingsSchema: Schema = new Schema({
  textSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
  },
  darkMode: {
    type: Boolean,
  },
  highContrast: {
    type: Boolean,
  },
  screenReader: {
    type: Boolean,
  },
});

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
      type: [{key: { type: Schema.Types.ObjectId, ref: 'Answer' }, value: { type: Schema.Types.ObjectId, ref: 'Question' }}],
    },
    settings: {
      darkMode: Boolean,
      textSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
      },
      screenReader: Boolean,
    },
    setting2: accessibilitySettingsSchema,
  },
  { collection: 'Account' },
);

export default accountSchema;
