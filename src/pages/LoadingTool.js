import React from "react";
import "./LoadingTool.css";
import { ReactComponent as LoadingIcon } from "../assets/img/loading.svg";
import LottiePlayer from "../components/LottiePlayer";
//import LottieLoading from "../assets/lottie/loading.json";
import LottieLoading from "../assets/lottie/jumpinstagram.json";

function LoadingTool({ type }) {
  const anim =
    type === "loading" ? (
      <LoadingIcon fill="gray" />
    ) : (
      <LottiePlayer animationData={LottieLoading} size="10rem" />
    );
  return <div className="loading-area">{anim}</div>;
}

export default LoadingTool;
