import React, { useState } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "react-use-gesture";

import styles from "./styles.module.css";
import { Avatar, makeStyles } from "@material-ui/core";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

// const cards2 = [
//   "https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg",
//   "https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg",
//   "https://upload.wikimedia.org/wikipedia/en/9/9b/RWS_Tarot_07_Chariot.jpg",
//   "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg",
//   "https://upload.wikimedia.org/wikipedia/en/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg",
//   "https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg",
// ];
const cards = [
  "https://firebasestorage.googleapis.com/v0/b/lge-instagram.appspot.com/o/images%2F3180C630-E62C-4649-B94C-FC6A82EFD339.jpeg?alt=media&token=20505e28-670c-45fd-a400-8251e25e4f8a",
  "https://firebasestorage.googleapis.com/v0/b/lge-instagram.appspot.com/o/images%2FC7DCB392-AF06-4D17-95CE-7EF795AA5CE5.gif?alt=media&token=7a55b300-37d1-4e34-a13d-5126a36ed297",
  "https://firebasestorage.googleapis.com/v0/b/lge-instagram.appspot.com/o/images%2FC18A6F56-42BB-43A7-83D4-3C7E88A152CE.jpeg?alt=media&token=c23cc29b-140a-428e-b873-5ad46726a8c1",
  "https://firebasestorage.googleapis.com/v0/b/lge-instagram.appspot.com/o/images%2F54c107302fd808.jpeg?alt=media&token=dcb44950-b9da-433b-bb70-ecaf7def6243",
  "https://firebasestorage.googleapis.com/v0/b/lge-instagram.appspot.com/o/images%2FB440FB6C-DF33-488C-A66E-92C13CE840C2.jpeg?alt=media&token=26eb9d95-a7cd-4701-97e3-902a4b7b95e1",
  "https://firebasestorage.googleapis.com/v0/b/lge-instagram.appspot.com/o/images%2F4CCECC73-B892-4E4A-8902-525C1C1B97DE.jpeg?alt=media&token=3a98aee0-eaae-42e1-bebe-b211f761adc1",
];

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

function Deck() {
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, api] = useSprings(cards.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });
      if (!down && gone.size === cards.length)
        setTimeout(() => {
          gone.clear();
          api.start((i) => to(i));
        }, 600);
    }
  );
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className={styles.deck} key={i} style={{ x, y }}>
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${cards[i]})`,
            }}
          />
        </animated.div>
      ))}
    </>
  );
}

const useStyles = makeStyles(() => ({
  small: {
    width: "1.5rem",
    height: "1.5rem",
  },
}));

export default function CardStack() {
  const classes = useStyles();
  const history = useHistory();
  const signOut = (event) => {
    event.preventDefault();
    setTimeout(() => {
      auth.signOut().then(() => {
        //alert("You have been logged out successfully");
        history.push({
          pathname: "/",
          state: { from: history.location.pathname },
        });
      });
    }, 800);
  };
  return (
    <>
      <header>
        <div className="header-container">
          <button
            className="about__headerback"
            onClick={() => setTimeout(() => history.goBack(), 700)}
          >
            <ArrowBackIosIcon className="arrow_back" />
          </button>
          <img
            className="main__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
          <button className="main__headerAvatar" onClick={signOut}>
            <Avatar className={classes.small} src="/broken-image.jpg" />
          </button>
        </div>
      </header>
      <div className={`flex fill center ${styles.container}`}>
        <Deck />
      </div>
    </>
  );
}
