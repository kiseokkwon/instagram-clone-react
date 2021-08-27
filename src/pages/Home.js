import "./Home.css";
import React, { useState } from "react";
import { Backdrop, Fade, makeStyles, Modal } from "@material-ui/core";
import { auth } from "../firebase";
// import cellphone from "../lottie/cellphone.json";
import instagram from "../assets/lottie/instagram-icon.json";
import socialmedia from "../assets/lottie/socialmedia.json";
import LottiePlayer from "../components/LottiePlayer";
import SignForm from "../components/SignForm";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    width: "21.25rem",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 4, 2),
    boxSizing: "border-box",
    borderRadius: "0.312rem",
  },
}));

function Home() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [modaltype, setModaltype] = useState(0);

  const handleOpen = (e) => {
    e.preventDefault();
    switch (e.target.textContent) {
      case "로그인":
        setModaltype(1);
        setOpen(true);
        break;
      case "가입하기":
        setModaltype(2);
        setOpen(true);
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const signInGuest = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword("test@lge.com", "123qwe")
      .then(() => {
        setOpen(false);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <div className="home">
        <header>
          <div className="lottie_player">
            <LottiePlayer
              animationData={instagram}
              size="6rem"
              options={{ loop: false }}
            />
          </div>
        </header>
        <main>
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png"
            alt=""
          />
          <h5>친구들의 사진과 동영상을 보려면 가입하세요.</h5>
          <h5>
            <span onClick={handleOpen}>로그인</span>
            {" 또는 "}
            <span onClick={handleOpen}>가입하기</span>
          </h5>
          <h5 className="loginguest" onClick={signInGuest}>
            게스트 로그인
          </h5>
          <div className="lottie_player">
            <LottiePlayer
              animationData={socialmedia}
              size="30vh"
              style={{ marginTop: "5vh" }}
            />
          </div>
        </main>
        <footer>
          <h6>from</h6>
          <h3>LG Electronics</h3>
        </footer>
      </div>

      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 800,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <SignForm type={modaltype} setOpen={setOpen} />
          </div>
        </Fade>
      </Modal>
    </>
  );
}

export default Home;
