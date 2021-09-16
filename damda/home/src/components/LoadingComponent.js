import React from 'react';
import loadingImage from '../css/ajax-loader.gif';
function LoadingComponent() {
  console.log('LoadingComponent!!!');
  return (
    <div
      style={{
        height: '1280px',
        width: '720px',
        zIndex: '1000',
        background: 'white',
        position: 'fixed',
        left: '0',
        right: '0',
        margin: 'auto',
      }}
    >
      <img
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
        }}
        src={loadingImage}
        alt="loading"
      />
    </div>
  );
}

export default LoadingComponent;
