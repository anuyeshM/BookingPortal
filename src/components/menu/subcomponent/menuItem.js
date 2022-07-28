import React, { useState } from 'react';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import DownArrrow from '../../../assets/images/iconDown.png';

import SubMenuItem from './subMenuItem';

export default function MenuItem(props) {
  const history = useHistory();
  const location = useLocation();
  const { url } = useRouteMatch();
  const [showSubItem, setShowSubItem] = useState(false);
  const isActive = location.pathname.match(url + '/' + props.data.id)
    ? true
    : false;

  return (
    <div className='menu-item-wrapper'>
      <div
        className={`menu-item ${props.data.id}${isActive ? '-active' : ''}`}
        data-ref={props.data.id}
        onClick={() => {
          history.push({
            pathname: `${url}/${props.data.id}`,
          });
          setShowSubItem(!showSubItem);
        }}>
        <div
          className={`display-text ${props.data.id}${isActive ? '-active' : ''}`}
          data-ref={props.data.id}>
          {props.data.display}
          {props.data.subItem && Array.isArray(props.data.subItem) ? (
            <img
              src={DownArrrow}
              height='24px'
              width='24px'
              style={{ marginLeft: '5px' }}
            />
          ) : null}
        </div>
      </div>
      {props.data.subItem &&
        Array.isArray(props.data.subItem) &&
        showSubItem &&
        props.data.subItem.map((item, index) => (
          <SubMenuItem
            {...props}
            data={item}
            key={item.id}
            selectedMenu={props.data.id}
            url={url}
          />
        ))}
    </div>
  );
}
