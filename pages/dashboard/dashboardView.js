import React from 'react';

import SideMenu from '../../components/menu/menu';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import DashboardSwitch from '../../routes/DashboardSwitch';

import './dashboard.css';

export default function DashboardView(props) {
  return (
    <div data-id='dashboard' className='dashboard db'>
      <div className='sidebar-container'>
        <SideMenu {...props} />
      </div>
      <div className='dashboard-content-wrapper'>
        <div className='header-container'>
          <Header {...props} />
        </div>
        <div className='page-content'>
          <div id='content' className='content'>
            <DashboardSwitch {...props} />
          </div>
        </div>
        <div className='footer-container'>
          <Footer />
        </div>
      </div>
    </div>
  );
}
