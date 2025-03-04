import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Answer collection.
 *
 * This schema defines the structure for storing answers in the database.
 * Each answer includes the following fields:
 * - `text`: The content of the answer.
 * - `ansBy`: The username of the user who provided the answer.
 * - `ansDateTime`: The date and time when the answer was given.
 * - `comments`: Comments that have been added to the answer by users.
 * - `locked`: Whether the answer is locked.
 * - `pinned`: Whether the answer is pinned.
 * - `isCorrect`: Whether the answer is marked as correct.
 */
const answerSchema: Schema = new Schema(
  {
    text: {
      type: String,
    },
    ansBy: {
      type: String,
    },
    ansDateTime: {
      type: Date,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    locked: {
      type: Boolean,
    },
    pinned: {
      type: Boolean,
    },
    draft: {
      type: Boolean,
    },
    isCorrect: {
      type: Boolean,
    },
  },
  { collection: 'Answer' },
);

export default answerSchema;
