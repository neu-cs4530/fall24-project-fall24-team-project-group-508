import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Account collection.
 *
 * This schema defines the structure for storing accounts in the database.
 * Each account includes the following fields:
 * - `username`: The username of the account
 * - `email`: the email associated with the account
 * - `hashedPassword`: The password of the account stored in a hash
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
        type: [{ type: Schema.Types.ObjectId, ref: 'Question' },]
    },
    downvotedAnswers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    },
    questionDrafts: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Question' },]
    },
    answerDrafts: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    }
  },
  { collection: 'Account' },
);

export default accountSchema;