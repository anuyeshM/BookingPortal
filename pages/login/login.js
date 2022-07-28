import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../../auth/authContext';
import SessionManager from '../../commons/session';
import LoginSwitch from '../../routes/LoginSwitch';
import PushAlert from '../../commons/notification';

import './login.css';

export default function Login(props) {
  const history = useHistory();
  const AuthManager = useContext(AuthContext);

  const checkPreviousLogin = () => {
    const loginRecord = SessionManager.getAuthSession();

    if(loginRecord && Object.keys(loginRecord).length>0) {
      if(SessionManager.isSessionValid(
        (loginRecord.data.data.expiresAt || loginRecord.data.token.expires_in)
      )) AuthManager.initiateLogin(loginRecord.data, () => 
        AuthManager.handleAuthentication(history, '/dashboard')
      ); 
    }
  };

  return (
    <div data-id="login-page" className="lp">
      <div className="login-form">
        <div className="login-view-area">
          <div className="login-title">Service Portal</div>
          <div className="dynamic-form">
            <LoginSwitch {...props} passIfLoggedIn={checkPreviousLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}
