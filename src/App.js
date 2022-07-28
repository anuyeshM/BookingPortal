import React, { useEffect, useState } from 'react';
import { AuthProvider } from './auth/authContext';
import SessionManager from './commons/session';
import GlobalFonts from './assets/fonts/fonts';
import RootSwitch from './routes/RootSwitch';
import PushAlert from './commons/notification';
import moment from 'moment';

import './App.css';

export default function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    accessToken: '',
    user: {},
    token: {}
  });

  const AuthManager = {
    ...auth,
    initiateLogin: (userObj, callback) => {
      const loggedInUser = {
        isAuthenticated: true,
        accessToken: (userObj.data && userObj.data.accessToken) || '',
        user: { ...userObj.data, role: 'manager' },
        token: userObj.data.accessToken || {}
      };

      localStorage.setItem('accessToken', loggedInUser.accessToken);
      SessionManager.setAuthSession(userObj);
      setAuth(loggedInUser);
      callback && callback();

      setTimeout(() => {
        AuthManager.resetAuth();
        SessionManager.resetAuthSession();
        SessionManager.getAuthSession() &&
          PushAlert.warning('Your session has expired. Please login again...');
      }, 1000 * moment(userObj.data.expiresAt).diff(moment(new Date()), 'seconds') || 3500000);
    },
    handleAuthentication: (navigator, navigateTo) => {
      navigator.push(navigateTo);
    },
    resetAuth: () => {
      setAuth({
        isAuthenticated: false,
        user: {},
        accessToken: ''
      });
      SessionManager.resetAuthSession();
    },
    logout: (params) => {
      AuthManager.resetAuth();
      SessionManager.resetAuthSession();
    }
  };

  useEffect(() => {
    // on refresh, update user info to context from session
    SessionManager.getAuthSession();
  });

  return (
    <AuthProvider value={AuthManager}>
      <GlobalFonts />
      <RootSwitch />
    </AuthProvider>
  );
}
