import supertest from 'supertest';
import mongoose from 'mongoose';
import * as applicationModel from '../models/application'; // Mocked model functions
import { app } from '../app';

jest.mock('../models/application');

describe('Account Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  describe('GET /:userName', () => {
    it('should return account details for a valid userName', async () => {
      const mockAccount = { id: '1', username: 'testUser', settings: {} };
      (applicationModel.getAccount as jest.Mock).mockResolvedValue(mockAccount);

      const response = await supertest(app).get('/account/testUser');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAccount);
      expect(applicationModel.getAccount).toHaveBeenCalledWith('testUser');
    });

    it('should return 500 if there is an error fetching account', async () => {
      (applicationModel.getAccount as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app).get('/account/testUser');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'ERROR: Unable to get account: Database error',
      });
    });
  });

  describe('GET /', () => {
    it('should return a list of accounts', async () => {
      const mockAccounts = [{ id: '1', username: 'testUser' }];
      (applicationModel.getAccounts as jest.Mock).mockResolvedValue(mockAccounts);

      const response = await supertest(app).get('/account/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAccounts);
      expect(applicationModel.getAccounts).toHaveBeenCalled();
    });

    it('should return 500 if there is an error fetching accounts', async () => {
      (applicationModel.getAccounts as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app).get('/account/');
      expect(response.status).toBe(500);
      expect(response.text).toBe('ERROR: Unable to get accounts: Database error');
    });
  });

  describe('PUT /settings/:accountId', () => {
    it('should update settings for a valid request', async () => {
      const mockUpdatedAccount = { id: '1', username: 'testUser', settings: { theme: 'dark' } };
      (applicationModel.updateAccountSettings as jest.Mock).mockResolvedValue(mockUpdatedAccount);

      const response = await supertest(app)
        .put('/account/settings/1')
        .send({ theme: 'dark', textSize: 'medium', screenReader: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedAccount);
      expect(applicationModel.updateAccountSettings).toHaveBeenCalledWith('1', {
        theme: 'dark',
        textSize: 'medium',
        screenReader: true,
      });
    });

    it('should return 400 for invalid settings', async () => {
      const response = await supertest(app)
        .put('/account/settings/1')
        .send({ theme: 'invalidTheme', textSize: 'medium', screenReader: true });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid settings request');
      expect(applicationModel.updateAccountSettings).not.toHaveBeenCalled();
    });

    it('should return 500 if there is an error updating settings', async () => {
      (applicationModel.updateAccountSettings as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      const response = await supertest(app)
        .put('/account/settings/1')
        .send({ theme: 'dark', textSize: 'medium', screenReader: true });

      expect(response.status).toBe(500);
      expect(response.text).toBe('ERROR: Unable to update settings for account: Database error');
    });
  });

  describe('PUT /userType/:userID', () => {
    it('should update user type for a valid request', async () => {
      const mockUpdatedAccount = { id: '1', username: 'testUser', userType: 'moderator' };
      (applicationModel.updateUserType as jest.Mock).mockResolvedValue(mockUpdatedAccount);

      const response = await supertest(app)
        .put('/account/userType/1')
        .send({ userType: 'moderator' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedAccount);
      expect(applicationModel.updateUserType).toHaveBeenCalledWith('1', 'moderator');
    });

    it('should return 400 for invalid userType', async () => {
      const response = await supertest(app)
        .put('/account/userType/1')
        .send({ userType: 'invalidType' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid user type' });
      expect(applicationModel.updateUserType).not.toHaveBeenCalled();
    });

    it('should return 404 if the account is not found', async () => {
      (applicationModel.updateUserType as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .put('/account/userType/1')
        .send({ userType: 'moderator' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Account not found' });
    });

    it('should return 500 if there is an error updating user type', async () => {
      (applicationModel.updateUserType as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .put('/account/userType/1')
        .send({ userType: 'moderator' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'ERROR: Unable to update user type: Database error',
      });
    });
  });
});
