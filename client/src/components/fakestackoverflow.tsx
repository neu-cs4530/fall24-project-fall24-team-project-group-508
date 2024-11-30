import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout';
import Login from './login';
import { Account, FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import { CustomThemeProvider } from '../contexts/ThemeContext';
import { TextSizeProvider } from '../contexts/TextSizeContext';
import ProfilePage from './main/profilePage';
import DraftPage from './main/draftPage';

const ProtectedRoute = ({
  user,
  account,
  setAccount,
  socket,
  children,
}: {
  user: User | null;
  account: Account | null;
  setAccount: (account: Account | null) => void;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket || !account) {
    return <Navigate to='/' />;
  }

  return (
    <UserContext.Provider value={{ user, account, setAccount, socket }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);

  return (
    <CustomThemeProvider initialTheme='light'>
      <TextSizeProvider initialTextSize={'medium'}>
        <LoginContext.Provider value={{ setUser, setAccount }}>
          <Routes>
            {/* Public Route */}
            <Route path='/' element={<Login />} />
            <Route path='/' element={<Navigate to={'/'} />} />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute
                  user={user}
                  account={account}
                  setAccount={setAccount}
                  socket={socket}>
                  <Layout />
                </ProtectedRoute>
              }>
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/draft/:qid/:parentType/:type/:id' element={<DraftPage />} />
              <Route path='/home' element={<QuestionPage />} />
              <Route path='tags' element={<TagPage />} />
              <Route path='/question/:qid' element={<AnswerPage />} />
              <Route path='/new/question' element={<NewQuestionPage />} />
              <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
            </Route>
          </Routes>
        </LoginContext.Provider>
      </TextSizeProvider>
    </CustomThemeProvider>
  );
};

export default FakeStackOverflow;
