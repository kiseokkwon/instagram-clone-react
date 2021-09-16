import React from 'react';

function NaviButton({ isLoading }) {
  return (
    <div>
      <div className="gnb" data-ani={!isLoading && 'fadein__bottom'}>
        <button className="button button__back">
          <span className="blind">back</span>
        </button>
        <a href="#a" className="button button__home">
          <span className="blind">home</span>
        </a>
        <button className="button button__alert">
          <span className="blind">alarm</span>
        </button>
      </div>
    </div>
  );
}

export default NaviButton;
