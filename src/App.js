import "./App.css";
import React, { useEffect, useState } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Main from "./pages/Main";
import LoadingTool from "./pages/LoadingTool";
import CardStack from "./spring/CardStack";
import { auth } from "./firebase";

function App() {
  const [animated, setAnimated] = useState(false);
  const [animatedType, setAnimatedType] = useState(0); // 1:scale, 2:scale-hole
  const [dynamicStyle, setDynamicStyle] = useState({});
  const [user, setUser] = useState(undefined);

  const handleAnimation = (event) => {
    let type = 0;
    if (event.target.textContent === "게스트 로그인") {
      type = 2;
    } else if (
      event.target.parentElement.className === "about__headerback" ||
      event.target.parentElement.className.baseVal ===
        "MuiSvgIcon-root arrow_back" ||
      event.target.className.baseVal === "MuiSvgIcon-root MuiAvatar-fallback" ||
      event.target.parentElement.className.baseVal ===
        "MuiSvgIcon-root MuiAvatar-fallback" ||
      String(event.target.className).includes("MuiAvatar") ||
      String(event.target.parentElement.className).includes("MuiAvatar") ||
      event.target.className === "avatar" ||
      event.target.parentElement.className === "avatar"
    ) {
      type = 1;
    }
    if (type === 0) {
      return false;
    }
    setAnimatedType(type);
    setDynamicStyle({
      top: `calc(${event.clientY}px - max(50vw, 50vh))`,
      left: `calc(${event.clientX}px - max(50vw, 50vh))`,
    });
    setAnimated(true);
    setTimeout(
      () => {
        setAnimated(false);
      },
      type === 2 ? 4000 : 2500
    );
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        document.title = "Instagram";
      }
      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="eventContainer" onClick={handleAnimation}>
      <div
        className={
          animated ? "animationContainer animated" : "animationContainer"
        }
      >
        <div
          className={
            animated
              ? animatedType === 1
                ? "circle scale-anim"
                : "circle scale-hole-anim"
              : "circle"
          }
          style={dynamicStyle}
        />
      </div>
      {user === undefined && <LoadingTool type="loading" />}
      <HashRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (user ? <Redirect to="/main" /> : <Home />)}
          />
          <Route exact path="/main" component={Main} />
          <Route exact path="/about" component={CardStack} />
        </Switch>
      </HashRouter>
    </div>
  );
}
export default App;
