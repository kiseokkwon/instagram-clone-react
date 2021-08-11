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

function LottiePlayer({ animationData, size }) {
  return (
    <div className="lottieContainer">
      <Lottie
        options={{ ...lottieOptions, animationData }}
        isStopped={false}
        isPaused={false}
        isClickToPauseDisabled={false}
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
