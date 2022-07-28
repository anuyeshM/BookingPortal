import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import Services from '../components/content/services/services';

const DashboardSwitch = (props) => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/services`}>
        <Services {...props} />
      </Route>
      <Redirect from={path} to={`${path}/services`} />
    </Switch>
  );
};

export default DashboardSwitch;
