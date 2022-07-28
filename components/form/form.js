import React, { useState } from 'react';
import AddEditServiceForm from './subcomponent/addEditServiceForm';
import './addEditService.css';

export default function AddEditForm(props) {
  return (
    <div className="add-edit-service">
      <AddEditServiceForm {...props} />
    </div>
  );
}
