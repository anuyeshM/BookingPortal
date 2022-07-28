import React, { useMemo, useState } from 'react';

import StoreInfo from './subcomponent/storeInfo';
import MenuItem from './subcomponent/menuItem';

import appConfig from '../../commons/config';
import './menu.css';

export default function SideMenu(props) {
  const actions = useMemo(() => appConfig.actions, []);

  const [isMenuVisible, setMenuVisible] = useState(false);

  return (
    <div className={`menu ${isMenuVisible ? 'menu-visible' : ''}`}>
      <div className='menu-content'>
        <div className='store-info'>
          <StoreInfo {...props} />
        </div>
        <div
          className='actions'
          onMouseEnter={(e) => setMenuVisible(true)}
          onMouseLeave={(e) => setMenuVisible(false)}
        >
          {actions.map((e, i) => (
            <MenuItem
              key={`MenuItem${i}`}
              {...props}
              data={e}
              subActions={e.subActions}
            />
          ))}
        </div>
      </div>
      <div
        className='hamburger-icon'
        onClick={(e) => setMenuVisible(!isMenuVisible)}
      ></div>
    </div>
  );
}
