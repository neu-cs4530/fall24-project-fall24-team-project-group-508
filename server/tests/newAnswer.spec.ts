import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { Answer } from '../types';

const saveAnswerSpy = jest.spyOn(util, 'saveAnswer');
const addAnswerToQuestionSpy = jest.spyOn(util, 'addAnswerToQuestion');
const popDocSpy = jest.spyOn(util, 'populateDocument');

describe('POST /addAnswer', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new answer to the question', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      locked: false,
      pinned: false,
      isCorrect: false,
    };
    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);

    addAnswerToQuestionSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
      presetTags: [],
      locked: false,
      pinned: false,
    });

    popDocSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer],
      comments: [],
      presetTags: [],
      locked: false,
      pinned: false,
    });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validAid.toString(),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      locked: false,
      pinned: false,
      ansDateTime: mockAnswer.ansDateTime.toISOString(),
      comments: [],
      isCorrect: false,
    });
  });

  it('should return bad request error if answer text property is missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid answer');
  });

  it('should return bad request error if request body has qid property missing', async () => {
    const mockReqBody = {
      ans: {
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if answer object has ansBy property missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'This is a test answer',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if answer object has ansDateTime property missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/answer/addAnswer');

    expect(response.status).toBe(400);
  });

  it('should return database error in response if saveAnswer method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId().toString();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    saveAnswerSpy.mockResolvedValueOnce({ error: 'Error when saving an answer' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return database error in response if update question method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId().toString();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: new ObjectId('507f191e810c19729de860ea'),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      locked: false,
      pinned: false,
      isCorrect: false,
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);
    addAnswerToQuestionSpy.mockResolvedValueOnce({ error: 'Error when adding answer to question' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return database error in response if `populateDocument` method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: new ObjectId('507f191e810c19729de860ea'),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      locked: false,
      pinned: false,
      isCorrect: false,
    };

    const mockQuestion = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
      presetTags: [],
      locked: false,
      pinned: false,
      isCorrect: false,
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);
    addAnswerToQuestionSpy.mockResolvedValueOnce(mockQuestion);
    popDocSpy.mockResolvedValueOnce({ error: 'Error when populating document' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });
});

const markAnswerCorrectSpy = jest.spyOn(util, 'markAnswerCorrect');

describe('PUT /updateCorrectAnswer', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should mark an answer as correct', async () => {
    const validAnsId = new mongoose.Types.ObjectId();
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        _id: validAnsId,
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
        isCorrect: false,
      },
    };

    const mockUpdatedAnswer: Answer = {
      _id: validAnsId,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      locked: false,
      pinned: false,
      isCorrect: true,
    };

    const mockResponse = {
      _id: validAnsId.toString(),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: '2024-06-03T00:00:00.000Z',
      comments: [],
      locked: false,
      pinned: false,
      isCorrect: true,
    };

    markAnswerCorrectSpy.mockResolvedValueOnce(mockUpdatedAnswer as Answer);

    const response = await supertest(app).put('/answer/updateCorrectAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
    expect(markAnswerCorrectSpy).toHaveBeenCalledWith(validAnsId.toString(), true);
  });

  it('should mark an answer as incorrect if already correct', async () => {
    const validAnsId = new mongoose.Types.ObjectId();
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        _id: validAnsId,
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
        isCorrect: true,
      },
    };

    const mockUpdatedAnswer: Answer = {
      _id: validAnsId,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      locked: false,
      pinned: false,
      isCorrect: false,
    };

    const mockResponse = {
      _id: validAnsId.toString(),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: '2024-06-03T00:00:00.000Z',
      comments: [],
      locked: false,
      pinned: false,
      isCorrect: false,
    };

    markAnswerCorrectSpy.mockResolvedValueOnce(mockUpdatedAnswer as Answer);

    const response = await supertest(app).put('/answer/updateCorrectAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
    expect(markAnswerCorrectSpy).toHaveBeenCalledWith(validAnsId.toString(), false);
  });

  it('should return bad request error if qid is missing', async () => {
    const mockReqBody = {
      ans: {
        _id: 'dummyAnswerId',
        isCorrect: false,
      },
    };

    const response = await supertest(app).put('/answer/updateCorrectAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request or answer');
    expect(markAnswerCorrectSpy).not.toHaveBeenCalled();
  });

  it('should return bad request error if answer is invalid', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'Invalid answer object',
      },
    };

    const response = await supertest(app).put('/answer/updateCorrectAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request or answer');
    expect(markAnswerCorrectSpy).not.toHaveBeenCalled();
  });

  it('should return internal server error if database update fails', async () => {
    const validAnsId = new mongoose.Types.ObjectId();
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        _id: validAnsId,
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
        isCorrect: false,
      },
    };

    markAnswerCorrectSpy.mockRejectedValueOnce(new Error('Database error occurred'));

    const response = await supertest(app).put('/answer/updateCorrectAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating answer: Database error occurred');
    expect(markAnswerCorrectSpy).toHaveBeenCalledWith(validAnsId.toString(), true);
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).put('/answer/updateCorrectAnswer');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request or answer');
    expect(markAnswerCorrectSpy).not.toHaveBeenCalled();
  });
});
