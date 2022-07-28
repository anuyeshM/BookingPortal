import React from 'react';
import './services.css';
import AddServiceSwitch from '../../../routes/addServiceSwitch';

import '../../form/addEditService.css';

export default function Services(props) {
  return (
    <div className="service-container">
      <AddServiceSwitch {...props} />
    </div>
  );
}
