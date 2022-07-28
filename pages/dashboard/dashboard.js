import React from 'react';
import { useHistory } from 'react-router-dom';
import { AuthConsumer } from '../../auth/authContext';
import Can from '../../auth/can';

import DashboardView from './dashboardView';

export default function Dashboard(props) {
  const history = useHistory();

  const requireLogin = () => {
    history.push('/login');
  };

  return (
    <AuthConsumer>
      {({ isAuthenticated, user, token }) =>
        isAuthenticated ? (
          <Can
            role={user.role}
            data={user}
            perform='dashboard:read'
            yes={() => <DashboardView {...props} user={user} token={token} />}
            no={() => {
              history.push('/error');
            }}
          />
        ) : (
          requireLogin()
        )
      }
    </AuthConsumer>
  );
}
