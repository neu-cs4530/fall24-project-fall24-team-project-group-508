import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Question collection.
 *
 * This schema defines the structure for storing questions in the database.
 * Each question includes the following fields:
 * - `title`: The title of the question.
 * - `text`: The detailed content of the question.
 * - `tags`: An array of references to `Tag` documents associated with the question.
 * - `answers`: An array of references to `Answer` documents associated with the question.
 * - `askedBy`: The username of the user who asked the question.
 * - `askDateTime`: The date and time when the question was asked.
 * - `views`: An array of usernames that have viewed the question.
 * - `upVotes`: An array of usernames that have upvoted the question.
 * - `downVotes`: An array of usernames that have downvoted the question.
 * - `comments`: Comments that have been added to the question by users.
 * - `presetTags`: An array of preset tags that can be associated with the question.
 * - `locked`: Whether the question is locked.
 *  - `pinned`: Whether the question is pinned.
 */
const questionSchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    askedBy: {
      type: String,
    },
    askDateTime: {
      type: Date,
    },
    views: [{ type: String }],
    upVotes: [{ type: String }],
    downVotes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    presetTags: [
      {
        type: String,
        enum: [
          'C',
          'C++',
          'Java',
          'Python',
          'JavaScript',
          'HTML',
          'CSS',
          'SQL',
          'MongoDB',
          'React',
          'Angular',
          'Node.js',
          'OOD',
          'SWE',
          'Algorithms',
          'Data Structures',
          'Testing',
          'Debugging',
          'Version Control',
          'Security',
          'Web Development',
          'Mobile Development',
          'Cloud Computing',
          'DevOps',
          'Agile',
          'Scrum',
          'Kanban',
          'CI/CD',
          'Docker',
          'Kubernetes',
          'Microservices',
          'Serverless',
          'RESTful APIs',
          'GraphQL',
          'WebSockets',
          'OAuth',
          'JWT',
          'Cookies',
          'Sessions',
          'SQL Injection',
          'Buffer Overflows',
          'Markdown',
          'Latex',
        ],
        default: [],
      },
    ],
    locked: {
      type: Boolean,
    },
    pinned: {
      type: Boolean,
    },
    draft: {
      type: Boolean,
    },
  },
  { collection: 'Question' },
);

export default questionSchema;
