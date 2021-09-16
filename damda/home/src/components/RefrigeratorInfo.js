import React from 'react';

function RefrigeratorInfo({ isLoading }) {
  console.log('RefrigeratorInfo rendering');
  return (
    <div className="control__box--info">
      <div className="control__box--inner" data-ani={!isLoading && 'fadein_5'}>
        <div className="control__box--flex flex flex__center">
          <i className="icon__cold "></i>
          <p className="text__small">냉장</p>
          <p className="text__mlarge spoqa__bold">1&#8451;</p>
        </div>
      </div>
      <div
        className="control__box--inner bottom"
        data-ani={!isLoading && 'fadein_7'}
      >
        <div className="control__box--flex flex flex__center">
          <i className="icon__frozen"></i>
          <p className="text__small">냉동</p>
          <p className="text__mlarge spoqa__bold">-21&#8451;</p>
        </div>
      </div>
    </div>
  );
}

export default RefrigeratorInfo;
