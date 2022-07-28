import React from 'react';

import loading from '../assets/images/loading.gif';

const Loader = () => {
  return (
    <div
      style={{
        padding: '2rem 0',
        display: 'flex',
        height: '10rem',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <img src={loading} height="35px" width="35px" />
    </div>
  );
};

export default Loader;
