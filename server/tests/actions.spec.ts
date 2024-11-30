import supertest from 'supertest';
import mongoose from 'mongoose';
import { lockPost, pinPost, removePost } from '../models/application';
import { app } from '../app';

// Mock the model functions
jest.mock('../models/application');

describe('action Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  describe('POST /action/takeAction', () => {
    it('should return 400 for invalid requests missing required fields', async () => {
      const response = await supertest(app).post('/action/takeAction').send({
        actionType: 'pin',
        postType: 'question',
        postID: '123',
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe(
        'Invalid Action request, request must include a user, action type, post type and post id',
      );
    });

    it('should return 400 for incorrect postType', async () => {
      const response = await supertest(app).post('/action/takeAction').send({
        user: 'testUser',
        actionType: 'pin',
        postType: 'invalidType',
        postID: '123',
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe(
        'incorrect information in action request, must correctly specifiy a post type and action type',
      );
    });

    it('should call pinPost and return 200 on successful pin action', async () => {
      (pinPost as jest.Mock).mockResolvedValue({ question: { id: '123' } });

      const response = await supertest(app).post('/action/takeAction').send({
        user: 'testUser',
        actionType: 'pin',
        postType: 'question',
        postID: '123',
        parentID: '456',
        parentPostType: 'answer',
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe('action completed successfully');
      expect(pinPost).toHaveBeenCalledWith('question', '123', '456', 'answer');
    });

    it('should call lockPost and return 200 on successful lock action', async () => {
      (lockPost as jest.Mock).mockResolvedValue({ question: { id: '123' } });

      const response = await supertest(app).post('/action/takeAction').send({
        user: 'testUser',
        actionType: 'lock',
        postType: 'question',
        postID: '123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe('action completed successfully');
      expect(lockPost).toHaveBeenCalledWith('question', '123');
    });

    it('should call removePost and return 200 on successful remove action', async () => {
      (removePost as jest.Mock).mockResolvedValue({ answer: { id: '456' } });

      const response = await supertest(app).post('/action/takeAction').send({
        user: 'testUser',
        actionType: 'remove',
        postType: 'answer',
        postID: '123',
        parentID: '456',
        parentPostType: 'answer',
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe('action completed successfully');
      expect(removePost).toHaveBeenCalledWith('answer', '123', '456', 'answer');
    });

    it('should return 501 for unsupported action', async () => {
      const response = await supertest(app).post('/action/takeAction').send({
        user: 'testUser',
        actionType: 'unsupportedAction',
        postType: 'question',
        postID: '123',
      });

      expect(response.status).toBe(501);
      expect(response.text).toBe('The action unsupportedAction is currently unsupported');
    });

    it('should return 501 for promote action', async () => {
      const response = await supertest(app).post('/action/takeAction').send({
        user: 'testUser',
        actionType: 'promote',
        postType: 'question',
        postID: '123',
      });

      expect(response.status).toBe(501);
      expect(response.text).toBe(
        'Promote action is currently unimplemented. This will be changed during sprint 3',
      );
    });

    it('should return 401 on errors thrown by the model functions', async () => {
      (pinPost as jest.Mock).mockRejectedValue(new Error('Something went wrong'));

      const response = await supertest(app).post('/action/takeAction').send({
        user: 'testUser',
        actionType: 'pin',
        postType: 'question',
        postID: '123',
      });

      expect(response.status).toBe(401);
      expect(response.text).toBe('Something went wrong');
    });
  });
});
