import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Answer collection.
 *
 * This schema defines the structure for storing drafts in the database.
 * Each answer includes the following fields:
 * - `text`: The content of the answer.
 * - `ansBy`: The username of the user who provided the answer.
 * - `ansDateTime`: The date and time when the answer was given.
 * - `comments`: Comments that have been added to the answer by users.
 */
const draftAnswerSchema: Schema = new Schema(
  {
    username: {
      type: String,
    },
    realId: {
      type: String,
      required: false,
    },
    qid: {
      type: String,
    },
    editId: {
      type: ObjectId,
    },
  },
  { collection: 'DraftAnswer' },
);

export default draftAnswerSchema;
