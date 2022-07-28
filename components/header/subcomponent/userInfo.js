import React, { useState, useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext, { AuthConsumer } from '../../../auth/authContext';

import Config from '../../../commons/config';
import CallAPI from '../../../commons/callAPI';
import PushAlert from '../../../commons/notification';
import AnonymousUserIcon from '../../../assets/images/profile-user.png';

export default function UserInfo(props) {
  const accessToken = useMemo(() => props.token, []);

  const AuthManager = useContext(AuthContext);
  const history = useHistory();
  const apiConfig = useMemo(() => Config.api, []);
  const [isOptionsTriggered, setOptionsTriggered] = useState(false);

  const doLogout = async () => {
    // let apiResponse = await CallAPI.post(apiConfig.logout, { accessToken }, accessToken.access_token);
    // let responseObj = await apiResponse.json();

    // if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
    //   PushAlert.success(responseObj.message || responseObj.status);
    // } else {
    //   PushAlert.error(responseObj.message || responseObj.status);
    // }

    let apiResponse = await CallAPI.put_logout(apiConfig.logout, {}, props.user.accessToken, props.user.refreshToken);
    let responseObj = await apiResponse.json();

    if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
      PushAlert.success(responseObj.message || responseObj.status);
    } else {
      PushAlert.error(responseObj.message || responseObj.status);
    }

    AuthManager.logout();
    console.log("Logout called");
    history.push('/login');
    setOptionsTriggered(false);
  };

  return (
    <div className="user-info">
      <div className="user-meta">
        <div className="user-name">{(props.user.lastName || '') + ' ' + (props.user.firstName || '')}</div>
        {/* <div className="user-designation">Service Manager</div> */}
      </div>
      <div className="user-image">
        <img alt="user" src={AnonymousUserIcon} />
      </div>
      <div className="options" onClick={(e) => setOptionsTriggered(!isOptionsTriggered)} />
      {isOptionsTriggered ? (
        <div className="user-options">
          <div className="logout" onClick={(e) => doLogout()}>
            Logout
          </div>
        </div>
      ) : null}
    </div>
  );
}
