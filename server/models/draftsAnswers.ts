import mongoose, { Model } from 'mongoose';
import draftAnswerSchema from './schema/draftAnswer';
import { DraftAnswer } from '../types';

/**
 * Mongoose model for the `Answer` collection.
 *
 * This model is created using the `Answer` interface and the `answerSchema`, representing the
 * `Answer` collection in the MongoDB database, and provides an interface for interacting with
 * the stored answers.
 *
 * @type {Model<DraftAnswer>}
 */
const DraftAnswerModel: Model<DraftAnswer> = mongoose.model<DraftAnswer>(
  'DraftAnswer',
  draftAnswerSchema,
);

export default DraftAnswerModel;
