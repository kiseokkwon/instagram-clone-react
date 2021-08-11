import "./App.css";
import React, { useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Main from "./pages/Main";
import CardStack from "./spring/CardStack";

function App() {
  const [animated, setAnimated] = useState(false);
  const [dynamicStyle, setDynamicStyle] = useState({});

  const handleAnimation = (event) => {
    if (
      event.target.textContent !== "로그인" &&
      event.target.className !== "header-container" &&
      event.target.parentElement.className !== "about__headerback" &&
      event.target.parentElement.className !==
        "MuiSvgIcon-root MuiAvatar-fallback" &&
      event.target.parentElement.className !==
        "MuiAvatar-root MuiAvatar-circular makeStyles-small-18 MuiAvatar-colorDefault" &&
      event.target.parentElement.className !==
        "MuiAvatar-root MuiAvatar-circular makeStyles-small-34 MuiAvatar-colorDefault"
    ) {
      return;
    }
    setDynamicStyle({
      top: `calc(${event.clientY}px - 50vh)`,
      left: `calc(${event.clientX}px - 50vh)`,
    });
    setAnimated(true);
    setTimeout(() => {
      setAnimated(false);
    }, 2000);
  };
  return (
    <div className="animationContainer" onClick={handleAnimation}>
      <div
        className={animated ? "circle scale-anim" : "circle"}
        style={dynamicStyle}
      />
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/main" component={Main} />
          <Route exact path="/about" component={CardStack} />
        </Switch>
      </HashRouter>
    </div>
  );
}
export default App;
