import "./Home.css";
import React, { useEffect, useState } from "react";
import { Modal } from "@material-ui/core";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";
import LottiePlayer from "../lottie/LottiePlayer";
// import cellphone from "../lottie/cellphone.json";
import instagram from "../lottie/instagram-icon.json";
import socialmedia from "../lottie/socialmedia.json";
import SignForm from "../components/SignForm";

function Home() {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [modaltype, setModaltype] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        if (history.location.pathname !== "/main") {
          history.push({
            pathname: "/main",
            state: { from: history.location.pathname },
          });
        }
      } else {
        document.title = "Instagram";
      }
    });
    return unsubscribe;
  }, [history]);

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
    setModaltype(0);
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

      <Modal open={open} onClose={handleClose}>
        <div>
          <SignForm type={modaltype} setOpen={setOpen} />
        </div>
      </Modal>
    </>
  );
}

export default Home;
