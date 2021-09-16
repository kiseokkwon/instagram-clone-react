import React, { useState } from 'react';
import useInterval from '../hooks/useInterval';

const dayArray = [
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
  '일요일',
];

function InfoBox({ isLoading, theme }) {
  const [now, setnow] = useState(new Date());
  let month = now.getMonth();
  let day = now.getDay();
  let date = now.getDate();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let isAM = true;
  let minutesString = '' + minutes;

  useInterval(() => {
    let newNow = new Date();
    if (newNow.getMinutes() !== minutes) {
      setnow(newNow);
    }
  }, 10000);

  let weather = "맑음";

  if (hour > 12) {
    hour = hour - 12;
    isAM = false;
  }

  if (minutes < 10) {
    minutesString = '0' + minutes;
  }
  if (theme === "christmas") {
    month = 11;
    date = 25;
    weather = "눈";
  } else if (theme === "rainy") {
    weather = "비";
  }


  console.log('minutes', minutes);
  return (
    <div className={`info__box ${theme}`} data-ani={!isLoading && 'fadein'}>
      <p className="info__box--date text__large">
        <span>
          {month + 1}월 {date}일 {dayArray[day - 1]}
        </span>
      </p>
      <div className='info__box--time'>
        <p className='text__mid'>{isAM ? '오전' : '오후'}</p>
        <p className='text__xlarge spoqa__medium'>
          {hour}:{minutesString}
        </p>
      </div>
      <div className={`info__box--location ${theme}`}>
        <p className="text__small">
          <i className="icon__location"></i>
          <span className="location__name">서초구</span>
          <span className="location__weather">{weather}</span>
          <span className="location__temper">23&#8451;</span>
        </p>
      </div>
    </div>
  );
}

export default InfoBox;
