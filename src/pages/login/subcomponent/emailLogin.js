import React, { useContext, useState, useMemo, useEffect } from 'react';
import AuthContext from '../../../auth/authContext';
import { useHistory } from 'react-router-dom';

import PushAlert from '../../../commons/notification';
import CallAPI from '../../../commons/callAPI';
import Config from '../../../commons/config';

import TitleText from '../../../elements/text/title';
import TextInput from '../../../elements/input/textInput';
import LinkText from '../../../elements/text/link';
import PrimaryButton from '../../../elements/button/primary';
import PasswordInput from '../../../elements/input/passwordInput';

export default function EmailLogin(props) {
  const history = useHistory();
  const apiConfig = useMemo(() => Config.api, []);
  const appConfig = useMemo(() => Config.appDetails, []);
  const AuthManager = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    props.passIfLoggedIn && props.passIfLoggedIn();
  }, []);

  const doLogin = async () => {
    let apiResponse = await CallAPI.patch(apiConfig.loginWithPwd, {
      username,
      password,
      resource: appConfig.appName
    });

    let responseObj = await apiResponse.json();

    if (200 === +responseObj.status && 'success' === responseObj.type) {
      AuthManager.initiateLogin(responseObj, () => AuthManager.handleAuthentication(history, '/dashboard'));
    } else {
      PushAlert.error(responseObj.message || responseObj.status);
    }
  };

  return (
    <div className="login-password">
      <div className="inline wrapper">
        <TitleText className="input-text">User Name:</TitleText>
        <TextInput width="260px" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="inline wrapper">
        <TitleText className="input-text">Password:</TitleText>
        <PasswordInput
          style={{ width: '260px' }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={(e) => ('Enter' === e.key ? doLogin() : e.preventDefault())}
        />
      </div>
      <div className="login-options">
        <LinkText textAlign="left" onClick={(e) => history.push(`/login/mobile`)}>
          Login with OTP
        </LinkText>
        <LinkText textAlign="left" onClick={(e) => history.push(`/forgotPassword`)} fontColor={'#788083'}>
          Forgot Password?
        </LinkText>
      </div>
      <div className="login-action">
        <PrimaryButton fontColor="#fff" onClick={doLogin}>
          Login
        </PrimaryButton>
      </div>
    </div>
  );
}
