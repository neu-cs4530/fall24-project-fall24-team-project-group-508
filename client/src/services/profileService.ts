import { Account, User } from '../types';
import api from './config';

const LOGIN_API_URL = `${process.env.REACT_APP_SERVER_URL}/login`;

const getProfileData = async (account: User): Promise<Account> => {
  const res = await api.post(`${LOGIN_API_URL}/userData`, { profile: account });
  if (res.status !== 200) {
    throw new Error('Error while creating a new comment for the question');
  }

  return res.data;
};

export default getProfileData;
