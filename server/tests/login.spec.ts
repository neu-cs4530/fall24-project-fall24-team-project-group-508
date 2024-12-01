import supertest from 'supertest';
import mongoose from 'mongoose';
import {
  loginToAccount,
  createAccount,
  findUsersAnswers,
  findUsersAnswersDrafts,
  findUsersComments,
  findUsersQuestionDrafts,
  findUsersQuestions,
  getUserScore,
} from '../models/application';
import { app } from '../app';

// Mock the application model functions
jest.mock('../models/application');

const mockLoginToAccount = loginToAccount as jest.Mock;
const mockCreateAccount = createAccount as jest.Mock;

describe('POST /login/login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 200 with account details for a valid request', async () => {
    const mockAccount = { username: 'testuser', email: 'test@example.com' };
    mockLoginToAccount.mockResolvedValueOnce(mockAccount);

    const response = await supertest(app)
      .post('/login/login')
      .send({ username: 'testuser', hashedPassword: 'validpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAccount);
  });

  it('should return 400 if the request is invalid', async () => {
    const response = await supertest(app).post('/login/login').send({ username: 'testuser' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return 404 if the account does not exist', async () => {
    mockLoginToAccount.mockResolvedValueOnce({ error: 'Account does not exist' });

    const response = await supertest(app)
      .post('/login/login')
      .send({ username: 'nonexistent', hashedPassword: 'somepassword' });

    expect(response.status).toBe(404);
    expect(response.text).toBe('Account does not exist.');
  });

  it('should return 401 if the password is incorrect', async () => {
    mockLoginToAccount.mockResolvedValueOnce({ error: 'Incorrect password' });

    const response = await supertest(app)
      .post('/login/login')
      .send({ username: 'testuser', hashedPassword: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.text).toBe('Incorrect password.');
  });

  it('should return 500 for other errors', async () => {
    mockLoginToAccount.mockRejectedValueOnce(new Error('Unexpected error'));

    const response = await supertest(app)
      .post('/login/login')
      .send({ username: 'testuser', hashedPassword: 'validpassword' });

    expect(response.status).toBe(500);
    expect(response.text).toContain('ERROR: Unable to login: Unexpected error');
  });
});

describe('POST /login/createAccount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 200 with new account details for a valid request', async () => {
    const mockNewAccount = { username: 'newuser', email: 'new@example.com' };
    mockCreateAccount.mockResolvedValueOnce(mockNewAccount);

    const response = await supertest(app)
      .post('/login/createAccount')
      .send({ username: 'newuser', hashedPassword: 'securepassword', email: 'new@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockNewAccount);
  });

  it('should return 400 if the request is invalid', async () => {
    const response = await supertest(app)
      .post('/login/createAccount')
      .send({ username: 'newuser' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return 409 if the username already exists', async () => {
    mockCreateAccount.mockResolvedValueOnce({ error: 'username already exists' });

    const response = await supertest(app).post('/login/createAccount').send({
      username: 'existinguser',
      hashedPassword: 'securepassword',
      email: 'test@example.com',
    });

    expect(response.status).toBe(409);
    expect(response.text).toBe('An account with this username already exists.');
  });

  it('should return 409 if the email already exists', async () => {
    mockCreateAccount.mockResolvedValueOnce({ error: 'email already exists' });

    const response = await supertest(app).post('/login/createAccount').send({
      username: 'newuser',
      hashedPassword: 'securepassword',
      email: 'existing@example.com',
    });

    expect(response.status).toBe(409);
    expect(response.text).toBe('An account with this email already exists.');
  });

  it('should return 500 for other errors', async () => {
    mockCreateAccount.mockRejectedValueOnce(new Error('Unexpected error'));

    const response = await supertest(app)
      .post('/login/createAccount')
      .send({ username: 'newuser', hashedPassword: 'securepassword', email: 'new@example.com' });

    expect(response.status).toBe(500);
    expect(response.text).toContain('ERROR: Unable to create account: Unexpected error');
  });
});

jest.mock('../models/application');

const mockFindUsersQuestions = findUsersQuestions as jest.Mock;
const mockFindUsersAnswers = findUsersAnswers as jest.Mock;
const mockFindUsersComments = findUsersComments as jest.Mock;
const mockGetUserScore = getUserScore as jest.Mock;
const mockFindUsersAnswersDrafts = findUsersAnswersDrafts as jest.Mock;
const mockFindUsersQuestionDrafts = findUsersQuestionDrafts as jest.Mock;

describe('POST /login/userData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and send profile payload for a valid request', async () => {
    const mockPayload = {
      username: 'testuser',
      score: 50,
      questions: [{ id: 1, content: 'Sample question?' }],
      answers: [{ id: 2, content: 'Sample answer' }],
      comments: [{ id: 3, content: 'Sample comment' }],
      answerDrafts: [{ id: 4, content: 'Draft answer' }],
      questionDrafts: [{ id: 5, content: 'Draft question' }],
    };

    mockFindUsersQuestions.mockResolvedValueOnce(mockPayload.questions);
    mockFindUsersAnswers.mockResolvedValueOnce(mockPayload.answers);
    mockFindUsersComments.mockResolvedValueOnce(mockPayload.comments);
    mockGetUserScore.mockResolvedValueOnce(mockPayload.score);
    mockFindUsersAnswersDrafts.mockResolvedValueOnce(mockPayload.answerDrafts);
    mockFindUsersQuestionDrafts.mockResolvedValueOnce(mockPayload.questionDrafts);

    const response = await supertest(app)
      .post('/login/userData')
      .send({ profile: { username: 'testuser', hashedPassword: 'hashedpassword' } });

    expect(response.status).toBe(200);
    expect(response.text).toBe('data found succesfully');
  });

  it('should return 400 for an invalid request', async () => {
    const response = await supertest(app)
      .post('/login/userData')
      .send({ profile: { username: '' } });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return 401 if an error occurs during data retrieval', async () => {
    mockFindUsersQuestions.mockRejectedValueOnce(new Error('Database error'));

    const response = await supertest(app)
      .post('/login/userData')
      .send({ profile: { username: 'testuser', hashedPassword: 'hashedpassword' } });

    expect(response.status).toBe(401);
    expect(response.text).toContain('ERROR: Unable to retrieve account info: Database error');
  });
});
