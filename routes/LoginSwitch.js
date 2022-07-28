import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import EmailLogin from '../pages/login/subcomponent/emailLogin';
import MobileLogin from '../pages/login/subcomponent/mobileLogin';

const LoginSwitch = (props) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/email`}>
        <EmailLogin {...props} />
      </Route>
      <Route path={`${path}/mobile`}>
        <MobileLogin {...props} />
      </Route>
      <Redirect from={path} to={`${path}/email`} />
    </Switch>
  );
};

export default LoginSwitch;
