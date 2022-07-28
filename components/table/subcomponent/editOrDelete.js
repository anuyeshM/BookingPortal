import React from 'react';

export default function EditOrDelete(props) {
  return (
    <div className='action-container'>
      <div
        className='action-icon edit-icon'
        onClick={(e) => props.fromVariantsTable ? props.onEdit(props.data.original) : props.onEdit(props.data, props.metaData)}></div>
      <div
        className='action-icon delete-icon'
        onClick={(e) => props.onDelete(props.data, props.metaData)}></div>
      {props.renderEnterButton ? 
        <div
        className='action-icon enter-icon'
        onClick={(e) => props.onEnter(props.data, props.metaData)}></div>        
      : null}  
    </div>
  );
}
