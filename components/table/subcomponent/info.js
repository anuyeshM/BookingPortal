import React from 'react';

export default function Info(props) {
  return (
    <div className='action-container'>
      <div 
        className='action-icon info-icon'
        onClick={e => props.onInfo(props.data, props.metaData)} 
      ></div>
      {props.renderEnterButton ? 
        <div
        className='action-icon enter-icon'
        onClick={(e) => props.onEnter(props.data, props.metaData)}></div>        
      : null}
    </div>
  )
}