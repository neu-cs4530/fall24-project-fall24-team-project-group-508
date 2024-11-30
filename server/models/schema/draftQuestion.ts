import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';


const draftQuestionSchema: Schema = new Schema(
{
    username: {
        type: String,
    },
    realId: {
        type: String,
        required: false
    },
    editId: {
        type: ObjectId,
    },
    },
    { collection: 'DraftQuestion' },
);

export default draftQuestionSchema;