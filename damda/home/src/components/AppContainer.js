import React from 'react';
import Slider from 'react-slick';

let dragging = false;

function AppContainer(props) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    touchThreshold: 15,
    beforeChange: () => (dragging = true),
    afterChange: () => (dragging = false),
  };
  const { appList } = props;
  console.log('AppContainer props:', props);
  console.log('AppContainer props.appList:', appList);

  const length = appList.length;
  const temp = [];
  if (length % 3 !== 0) {
    for (let i = 0; i < 3 - (length % 3); i++) {
      temp.push({ componentName: '', tags: { link: '', thumbnail_url: '' } });
    }
  }
  const expandList = [...appList, ...temp];

  console.log('AppContainer length', expandList.length, 'temp: ', temp);

  const listItems = expandList.map((app) => {
    const { tags, componentName } = app;
    return (
      <div className='slider__triple--inner'>
        <div
          onClick={() => {
            if (dragging === false) document.location.href = tags.link;
          }}
          className='button'
        >
          <i
            style={{
              background: `url(${tags.thumbnail_url}) 50% 50% / 118px 118px no-repeat`,
              width: '118px',
              height: '118px',
              display: 'block',
              margin: '0 auto',
            }}
          />
          <span className='text__xsmall'>
            {tags.title ? tags.title : componentName}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div className='sliderWrap'>
      <div className='slider__triple'>
        <div className='slick-slider clear'>
          <Slider {...settings}>{listItems}</Slider>
          {/* <Slider {...settings}>
            <div className="slider__triple--inner">
              <div
                className="button"
                onClick={() => {
                  document.location.href = '#a';
                }}
              >
                <i className="icon__product--water"></i>
                <span className="text__xsmall">LG 디오스 정수기</span>
              </div>
            </div>
            <div className="slider__triple--inner">
              <div
                className="button"
                onClick={() => {
                  document.location.href = '#b';
                }}
              >
                <i className="icon__product--tableware"></i>
                <span className="text__xsmall">LG 식기세척기</span>
              </div>
            </div>
            <div className="slider__triple--inner">
              <div
                className="button"
                onClick={() => {
                  document.location.href = '#c';
                }}
              >
                <i className="icon__product--air"></i>
                <span className="text__xsmall">LG 공기청정</span>
              </div>
            </div>
            <div className="slider__triple--inner">
              <div
                className="button"
                onClick={() => {
                  document.location.href = '#d';
                }}
              >
                <i className="icon__product--wash"></i>
                <span className="text__xsmall">LG 세탁기</span>
              </div>
            </div>
            <div className="slider__triple--inner">
              <div
                className="button"
                onClick={() => {
                  document.location.href = '#e';
                }}
              >
                <i className="icon__product--dry"></i>
                <span className="text__xsmall">LG 건조기</span>
              </div>
            </div>
          </Slider> */}
        </div>
      </div>
    </div>
  );
}

export default AppContainer;
