import React, { useEffect, useState, useCallback } from 'react';
import '../css/import.css';
import InfoBox from './InfoBox';
import NaviButton from './NaviButton';
import RefrigeratorInfo from './RefrigeratorInfo';
import AppContainer from './AppContainer';
import Axios from 'axios';
import LoadingComponent from './LoadingComponent';

const themelist = ["", "rainy", "autumn", "christmas", "christmas_video"];
const videobglist = {christmas_video: "http://localhost:9100/res/videos/christmas.mp4"}

function Home() {
  const [appList, setAppList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [theme, setTheme] = useState("");

  console.log('Home');
  const sub_deploy_state = useCallback((coreName) => {
    console.log('sub_deploy_state');
    var deployMonitorSocket = new WebSocket('ws://localhost:9997');
    deployMonitorSocket.onopen = function (event) {
      console.log('deployMonitorSocket.onopen');
      var msg = JSON.stringify({ thing_name: coreName, caller: 'DAMDA Home' });
      deployMonitorSocket.send(msg);
    };
    deployMonitorSocket.onmessage = function (event) {
      if (event.data === 'SUCCEEDED') {
        console.log('deployMonitorSocket.onmessage');
        get_app_list();
      }
    };
  }, []);

  const init = useCallback(() => {
    console.log('init');
    let url = `${window.location.protocol}//${window.location.hostname}:5000/core`;
    Axios.get(url)
      .then((response) => {
        console.log(response.data.core_name);
        sub_deploy_state(response.data.core_name);
      })
      .catch((error) => {
        console.log('Error : ', error);
      });
  }, [sub_deploy_state]);

  useEffect(() => {
    console.log('Home useEffect');
    themelist.forEach((theme) => {
      if (theme) {
      var bg = new Image();
      bg.src = `http://localhost:9100/res/images/${theme}_bg.gif`;
      }
    });
    init();
    get_app_list();
  }, [init]);

  const get_app_list = () => {
    console.log('get_app_list');
    let url = `${window.location.protocol}//${window.location.hostname}:5000/core/components`;
    Axios.get(url)
      .then((response) => {
        let component_list = response.data.installedComponents;
        let app_list = [];
        console.log('components:', component_list);
        for (let idx in component_list) {
          let component = component_list[idx]['tags'];
          if (
            component &&
            Object.keys(component).includes('ui_component') &&
            component.ui_component === 'True'
          ) {
            app_list.push(component_list[idx]);
          }
        }
        setAppList(app_list);
        //setisLoading(false);
      })
      .catch((error) => {
        console.log('Error : ', error);
      });
  };

  console.log('appList:', appList);
  console.log('isLoading??:', isLoading);

  return (
    <div>
      {isLoading && <LoadingComponent />}
      <div className={`wrap bg__home ${theme}`}>
      {videobglist[theme] && <video
          className="bg__video"
          autoPlay
          muted
          loop
          src={videobglist[theme]}
          type="video/mp4"
        />}
        <div className={`bg__filter ${theme}`} />
        <div className="menu__top">
          <button
            className={`button button__setting ${theme}`}
            data-ani={!isLoading && 'fadein__top'}
            onClick={() => {
              console.log("onClick() - change theme");
              setTheme(t => {
                const cidx = themelist.indexOf(t);
                const sidx = (cidx + 1) % themelist.length;
                return themelist[sidx];
              });
              setisLoading(true);
              setInterval(() => {
                setisLoading(false);
              }, 150);
          }}
          >
            <span className="blind">설정</span>
          </button>
        </div>
        <>
          <InfoBox isLoading={isLoading} theme={theme} />

          <div
            className={`control__box ${theme}`}
            data-ani={!isLoading && 'fadein__bottom2'}
          >
            <RefrigeratorInfo isLoading={isLoading} />

            <AppContainer appList={appList} />
          </div>
        </>
        <NaviButton isLoading={isLoading} />
      </div>
    </div>
  );
}

export default Home;
