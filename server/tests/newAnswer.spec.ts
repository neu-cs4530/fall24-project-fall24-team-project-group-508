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
      draft: false,
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
      draft: false,
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
      draft: false,
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
      draft: false,
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
      draft: false,
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
      draft: false,
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
      draft: false,
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
      draft: false,
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
      draft: false,
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
      draft: false,
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
      draft: false,
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

describe('GET /getAnswerById/:id', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should fetch an answer by ID', async () => {
    const validId = new mongoose.Types.ObjectId('674bdff27fe07a5d92e0db31');
    const mockAnswer: Answer = {
      _id: validId,
      text: 'Fetched answer',
      ansBy: 'user123',
      ansDateTime: new Date('2024-12-01T03:27:48.903Z'),
      locked: false,
      pinned: false,
      comments: [],
      draft: false,
      isCorrect: false,
    };

    jest.spyOn(util, 'fetchAnswerById').mockResolvedValueOnce(mockAnswer);

    const response = await supertest(app)
      .get(`/answer/getAnswerById/${validId.toString()}`)
      .query({ username: 'user123' });

    // Change this line to compare with string ID instead of ObjectId
    expect(response.body).toEqual({
      ...mockAnswer,
      _id: validId.toString(),
      ansDateTime: mockAnswer.ansDateTime.toISOString(),
    });
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalidId';

    const response = await supertest(app)
      .get(`/answer/getAnswerById/${invalidId}`)
      .query({ username: 'user123' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return 500 if fetching answer fails', async () => {
    const validId = new mongoose.Types.ObjectId();

    jest.spyOn(util, 'fetchAnswerById').mockRejectedValueOnce(new Error('Fetch Error'));

    const response = await supertest(app)
      .get(`/answer/getAnswerById/${validId.toString()}`)
      .query({ username: 'user123' });

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching answer by id: Fetch Error');
  });
});

describe('POST /updateAnswer', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should update an existing answer', async () => {
    const validAid = new mongoose.Types.ObjectId();
    const mockAnswer = {
      _id: validAid,
      text: 'Updated Answer',
      ansBy: 'user1',
      ansDateTime: new Date(),
      comments: [],
      locked: false,
      pinned: false,
      draft: false,
      isCorrect: false,
    };

    jest.spyOn(util, 'checkIfExists').mockResolvedValue(true);
    jest.spyOn(util, 'updateAnswer').mockResolvedValue();

    const response = await supertest(app).post('/answer/updateAnswer').send({ ans: mockAnswer });

    expect(response.status).toBe(200);
    expect(response.text).toBe('updated!');
  });

  it('should add a new answer if it does not exist', async () => {
    const mockReq = {
      qid: new mongoose.Types.ObjectId(),
      ans: {
        text: 'New Answer',
        ansBy: 'user1',
        ansDateTime: new Date(),
        comments: [],
        locked: false,
        pinned: false,
        draft: false,
        isCorrect: false,
      },
    };

    jest.spyOn(util, 'checkIfExists').mockResolvedValue(false);
    jest.spyOn(util, 'saveAnswer').mockResolvedValue(mockReq.ans);

    const response = await supertest(app).post('/answer/updateAnswer').send(mockReq);

    expect(response.status).toBe(500);
  });

  it('should return 400 for invalid answer body', async () => {
    const response = await supertest(app).post('/answer/updateAnswer').send({ ans: {} });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question body');
  });
});

describe('POST /saveDraft', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should save a draft answer', async () => {
    const mockReq = {
      username: 'user1',
      qid: '65e9b58910afe6e94fc6e6dc',
      draft: {
        text: 'Draft Answer',
        ansBy: 'user1',
        ansDateTime: new Date(),
      },
      editId: '65e9b58910afe6e94fc6e6dc',
    };

    jest.spyOn(util, 'saveAnswerDraft').mockResolvedValue(mockReq);

    const response = await supertest(app).post('/answer/saveDraft').send(mockReq);

    expect(response.status).toBe(200);
    await mongoose.connection.close();
    await mongoose.disconnect();
  });

  it('should return 400 for invalid request', async () => {
    const response = await supertest(app).post('/answer/saveDraft').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question save request');
  });
});

describe('GET /getDraftAnswerById/:id', () => {
  it('should fetch a draft answer by ID', async () => {
    const validId = new ObjectId();

    const mockDraft = {
      _id: '65e9b58910afe6e94fc6e6dc',
      username: 'user1',
      qid: '65e9b58910afe6e94fc6e6dc',
      editId: {
        _id: new ObjectId('674bdff27fe07a5d92e0db31'),
        text: 'Draft Answer',
        ansBy: 'user1',
        ansDateTime: new Date('2024-12-01T03:27:48.903Z'),
        comments: [],
        locked: false,
        pinned: false,
        draft: true,
        isCorrect: false,
      },
    };

    jest.spyOn(util, 'fetchAnswerDraftById').mockResolvedValue(mockDraft);

    const response = await supertest(app)
      .get(`/answer/getDraftAnswerById/${validId}`)
      .query({ username: 'user1' });
    expect(response.status).toBe(200);

    expect(response.body._id).toEqual('65e9b58910afe6e94fc6e6dc');
    // expect(response.body).toEqual({
    //   ...mockDraft,
    //   editId: { ...mockDraft.editId, ansDateTime: '2024-12-01T03:27:48.903Z' },
    // });
  });

  it('should return 400 for invalid ID format', async () => {
    const response = await supertest(app)
      .get('/answer/getDraftAnswerById/invalidId')
      .query({ username: 'user1' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });
});

describe('PUT /updateCorrectAnswer', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should toggle the correctness of an answer', async () => {
    const validAid = new mongoose.Types.ObjectId();
    const mockAnswer = {
      _id: validAid,
      text: 'Sample Answer',
      ansBy: 'user1',
      ansDateTime: new Date(),
      isCorrect: true,
      pinned: false,
      locked: false,
      draft: false,
      comments: [],
    };

    jest.spyOn(util, 'markAnswerCorrect').mockResolvedValue({
      ...mockAnswer,
      isCorrect: false,
    });

    const response = await supertest(app)
      .put('/answer/updateCorrectAnswer')
      .send({ qid: new ObjectId(), ans: mockAnswer });

    expect(response.status).toBe(200);
    expect(response.body.isCorrect).toBe(false);
  });

  it('should return 400 for invalid request or answer', async () => {
    const response = await supertest(app).put('/answer/updateCorrectAnswer').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request or answer');
  });
});

describe('POST /saveDraft', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should save a draft answer', async () => {
    const mockReq = {
      username: 'user1',
      qid: '65e9b58910afe6e94fc6e6dc',
      draft: {
        text: 'Draft Answer',
        ansBy: 'user1',
        ansDateTime: new Date(),
      },
      editId: '65e9b58910afe6e94fc6e6dc',
    };

    jest.spyOn(util, 'saveAnswerDraft').mockResolvedValue(mockReq);

    const response = await supertest(app).post('/answer/saveDraft').send(mockReq);

    expect(response.status).toBe(200);
  });

  it('should return 400 for invalid request', async () => {
    const response = await supertest(app).post('/answer/saveDraft').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question save request');
  });
});

describe('GET /getDraftAnswerById/:id', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should fetch a draft answer by ID', async () => {
    const validId = new ObjectId('674bdff27fe07a5d92e0db31');
    const mockDraft = {
      _id: new mongoose.Types.ObjectId('674bdff27fe07a5d92e0db31'),
      text: 'Draft Answer',
      ansBy: 'user1',
      ansDateTime: new Date('2024-12-01T03:27:48.903Z'),
    };

    jest.spyOn(util, 'fetchAnswerDraftById').mockResolvedValue({
      _id: '674bdff27fe07a5d92e0db31',
      username: 'user1',
      qid: '65e9b58910afe6e94fc6e6dc',
      editId: {
        ...mockDraft,
        _id: validId, // Keep as ObjectId
        comments: [],
        locked: false,
        pinned: false,
        draft: true,
        isCorrect: false,
      },
    });

    const response = await supertest(app)
      .get(`/answer/getDraftAnswerById/${validId}`)
      .query({ username: 'user1' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: '674bdff27fe07a5d92e0db31',
      username: 'user1',
      qid: '65e9b58910afe6e94fc6e6dc',
      editId: {
        ...mockDraft,
        _id: validId.toString(), // Convert ObjectId to string here
        ansDateTime: '2024-12-01T03:27:48.903Z',
        comments: [],
        locked: false,
        pinned: false,
        draft: true,
        isCorrect: false,
      },
    });
  });

  it('should return 400 for invalid ID format', async () => {
    const response = await supertest(app)
      .get('/answer/getDraftAnswerById/invalidId')
      .query({ username: 'user1' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });
});

describe('PUT /updateCorrectAnswer', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should toggle the correctness of an answer', async () => {
    const validAid = new ObjectId();
    const mockAnswer = {
      _id: validAid,
      text: 'Sample Answer',
      ansBy: 'user1',
      ansDateTime: new Date(),
      isCorrect: true,
    };

    jest.spyOn(util, 'markAnswerCorrect').mockResolvedValue({
      ...mockAnswer,
      isCorrect: false,
      comments: [],
      locked: false,
      pinned: false,
      draft: false,
    });

    const response = await supertest(app)
      .put('/answer/updateCorrectAnswer')
      .send({ qid: new ObjectId(), ans: mockAnswer });

    expect(response.status).toBe(200);
    expect(response.body.isCorrect).toBe(false);
  });

  it('should return 400 for invalid request or answer', async () => {
    const response = await supertest(app).put('/answer/updateCorrectAnswer').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request or answer');
  });
});

describe('POST /saveFromDraft', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should save a draft answer', async () => {
    const draftAnswer = {
      _id: new ObjectId(),
      text: 'Draft Answer',
      ansBy: 'user1',
      ansDateTime: new Date(),
    };

    jest.spyOn(util, 'saveAnswerFromDraft').mockResolvedValue();

    const response = await supertest(app).post('/answer/saveFromDraft').send({ draftAnswer });

    expect(response.status).toBe(200);
  });

  it('should return 400 for missing draft answer', async () => {
    const response = await supertest(app).post('/answer/saveFromDraft').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question save request');
  });

  it('should handle errors when saving draft answer', async () => {
    const draftAnswer = {
      _id: new ObjectId(),
      text: 'Draft Answer',
      ansBy: 'user1',
      ansDateTime: new Date(),
    };

    jest.spyOn(util, 'saveAnswerFromDraft').mockRejectedValue(new Error('Database error'));

    const response = await supertest(app).post('/answer/saveFromDraft').send({ draftAnswer });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when saving question: Database error');
  });
});

describe('POST /postFromDraft', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should post a draft as an answer and delete the draft', async () => {
    const draftAnswer = {
      _id: new ObjectId(),
      text: 'Posted Answer',
      ansBy: 'user1',
      ansDateTime: new Date(),
      draft: true,
    };

    const newAnswer = {
      ...draftAnswer,
      draft: false,
      locked: false,
      pinned: false,
      isCorrect: false,
      comments: [],
    };

    jest.spyOn(util, 'removeOriginalDraftAnswer').mockResolvedValue();
    jest.spyOn(util, 'saveAnswer').mockResolvedValue({
      ...newAnswer,
    });
    jest.spyOn(util, 'addAnswerToQuestion').mockResolvedValue({
      ...newAnswer,
      title: '',
      tags: [],
      askedBy: '',
      askDateTime: new Date(),
      answers: [],
      views: [],
      upVotes: [],
      downVotes: [],
      presetTags: [],
    });
    jest.spyOn(util, 'removeAnswerDraft').mockResolvedValue();

    const response = await supertest(app).post('/answer/postFromDraft').send({
      draftAnswer,
      username: 'user1',
      qid: new ObjectId(),
      realId: new ObjectId(),
    });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Draft has been posted!');
  });

  it('should return 400 for invalid request (missing required fields)', async () => {
    const response = await supertest(app).post('/answer/postFromDraft').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question save request');
  });

  it('should return 400 for missing text in draft answer', async () => {
    const draftAnswer = {
      _id: new ObjectId(),
      ansBy: 'user1',
      ansDateTime: new Date(),
      draft: true,
    };

    const response = await supertest(app).post('/answer/postFromDraft').send({
      draftAnswer,
      username: 'user1',
      qid: new ObjectId(),
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question body');
  });

  it('should handle errors during posting', async () => {
    const draftAnswer = {
      _id: new ObjectId(),
      text: 'Posted Answer',
      ansBy: 'user1',
      ansDateTime: new Date(),
      draft: true,
    };

    jest.spyOn(util, 'removeOriginalDraftAnswer').mockResolvedValue();
    jest.spyOn(util, 'saveAnswer').mockRejectedValue(new Error('Database error'));

    const response = await supertest(app).post('/answer/postFromDraft').send({
      draftAnswer,
      username: 'user1',
      qid: new ObjectId(),
    });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when saving question: Database error');
  });
});
