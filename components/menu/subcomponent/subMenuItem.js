import React from 'react';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';

export default function SubMenuItem(props) {
    const history = useHistory();
    const location = useLocation();
    const { url } = useRouteMatch();
    let arr = location.pathname.split('/')
    const isActive = arr[3] === props.data.id
    ? true
    : false;
   
    return (
        <div 
            className={`sub-menu-item${isActive ? '-active' : ''}`}
            data-ref={props.data.id}
            key={props.data.id}
            onClick={() =>
                history.push({
                    pathname: `${url}/${props.selectedMenu}/${props.data.id}`,
                })
            }
        >
          <div
            className={`display-text${isActive ? '-active' : ''}`}
            data-ref={props.data.id}
          >
            <span className='display-text-bullet'>&#8226;</span>
            <span>{props.data.display}</span>
          </div>
      </div>
    );
}