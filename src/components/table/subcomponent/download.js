import React from 'react';

export default function Download(props) {
  return (
    <div className='action-container'>
      <div 
        className='action-icon download-icon'
        onClick={e => props.onDownload(props.data, props.metaData)}
      ></div>
      {props.renderEnterButton ? 
        <div
        className='action-icon enter-icon'
        onClick={(e) => props.onEnter(props.data, props.metaData)}></div>        
      : null}
    </div>
  )
}