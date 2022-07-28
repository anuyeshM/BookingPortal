import React from 'react';

export default function EditComponent(props) {
  return (
    <div className="action-container">
      <div
        className="action-icon edit-icon"
        onClick={(e) => props.onEdit(props.data.original)}
      ></div>
      {props.renderEnterButton ? 
        <div
        className='action-icon enter-icon'
        onClick={(e) => props.onEnter(props.data, props.metaData)}></div>        
      : null}
    </div>
  );
}
