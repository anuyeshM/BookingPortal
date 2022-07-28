import React from 'react';

import Clock from '../../elements/clock/clock';
import UserInfo from './subcomponent/userInfo';

import './header.css';

export default function Header(props) {
  return (
    <div className="header ">
      {/* <Clock /> */}
      <div className="header-search-image"></div>
      <div className="header-notification-image"></div>
      <UserInfo {...props} />
    </div>
  );
}
