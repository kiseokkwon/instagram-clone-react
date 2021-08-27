import React from "react";
import Lottie from "react-lottie";

const lottieOptions = {
  // animationData: instagram,
  loop: true,
  autoplay: true,
  rendererSettings: {
    className: "add-class", // svg에 적용
    preserveAspectRatio: "xMidYMid slice",
  },
};

function LottiePlayer({ animationData, size, options, style }) {
  return (
    <div className="lottieContainer" style={style}>
      <Lottie
        options={{ ...lottieOptions, animationData, ...options }}
        isStopped={false}
        isPaused={false}
        isClickToPauseDisabled={true}
        style={{ width: size, height: size }} // svg의 부모 div에 적용
        eventListeners={[
          {
            eventName: "complete",
            callback: () => console.log("the animation completed"),
          },
        ]}
      />
    </div>
  );
}

export default LottiePlayer;
