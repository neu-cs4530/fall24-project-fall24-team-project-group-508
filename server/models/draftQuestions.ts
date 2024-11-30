import mongoose, { Model } from 'mongoose';
import draftQuestionSchema from './schema/draftQuestion';
import { DraftQuestion } from '../types';

/**
 * Mongoose model for the `Answer` collection.
 *
 * This model is created using the `Answer` interface and the `answerSchema`, representing the
 * `Answer` collection in the MongoDB database, and provides an interface for interacting with
 * the stored answers.
 *
 * @type {Model<DraftQuestion>}
 */
const DraftQuestionModel: Model<DraftQuestion> = mongoose.model<DraftQuestion>('DraftQuestion', draftQuestionSchema);

export default DraftQuestionModel