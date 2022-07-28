import React, { useEffect, useState, useRef } from 'react';

export default function ProgressBar({ percent }) {
  const progressContainerRef = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(percent * progressContainerRef.current.offsetWidth / 100);
  });

  return (
    <div style={progressStyle.container}>
      <div style={progressStyle.progressDiv} ref={progressContainerRef}>
        <div style={{...progressStyle.progress, width: `${value}px`}} />
      </div>
      <div style={progressStyle.number}>{ percent } %</div>
    </div>
  );
};

const progressStyle = {
  container: {
    display: 'flex',
  },
  progressDiv: {
    margin: '12px auto',
    width: 'calc(100% - 80px)',
    backgroundColor: '#e9e9e9',
    borderRadius: '.5rem',
    height: '10px',
  },
  progress: {
    width: '0px',
    height: '10px',
    backgroundColor: '#48AF2C',
    borderRadius: '1rem',
    transition: '1s ease',
    transitionDelay: '0.5s',
  },
  number: {
    width: '60px',
    textAlign: 'right',
    fontSize: '20px',
    color: 'gray',
    fontWeight: 'bold',
  }
}