import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Account collection.
 *
 * This schema defines the structure for storing accounts in the database.
 * Each account includes the following fields:
 * - `username`: The username of the account
 * - `hashedPassword`: The password of the account stored in a hash
 */
const accountSchema: Schema = new Schema(
  {
    username: {
      type: String,
    },
    hashedPassword: {
      type: String,
    },
  },
  { collection: 'Account' },
);

export default accountSchema;
