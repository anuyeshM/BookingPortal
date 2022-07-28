import React, { useEffect, useMemo, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import './tabs.css';

export default function Tabs(props) {
  const history = useHistory();
  const { url } = useRouteMatch();

  const tabs = useMemo(() => props.data, []);
  const [selectedTab, setSelectedTab] = useState(0);

  const tabClick = (e) => {
    const tabId    = e.target.dataset.id;
    const tabIndex = +e.target.dataset.index;
    
    setSelectedTab(tabIndex);
    props.setActiveTab && props.setActiveTab(tabId);
    
    history.push({
      pathname: `${url}/${tabId}`,
      state: props,
    });
  }

  useEffect(() => {}, [selectedTab]);
  
  return (
    <div className='tc tabs-container'>
      {
        tabs.map((tab, ind) => (
          <div 
            key={`Tab-${ind}`}
            className={`tab ${selectedTab === ind ? 'active' : ''} ${props.onlyFirstTab && ind>0 ? 'disabled' : ''}`} 
            data-id={tab.routeId}
            data-index={ind}
            onClick={tabClick}
          >
            {tab.displayName}
          </div>
        ))
      }
    </div>
  )
}