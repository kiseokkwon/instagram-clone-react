import React, { useEffect, useState } from "react";
import "./Main.css";
import { useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import { Avatar, Backdrop, Fade, makeStyles, Modal } from "@material-ui/core";
import ImageUploader from "../components/ImageUploader";
import Post from "../components/Post";
import { ReactComponent as NewStoryIcon } from "../assets/img/newstory.svg";
import LoadingTool from "./LoadingTool";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "18.75rem",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 2),
    boxSizing: "border-box",
    borderRadius: "0.312rem",
  },
  small: {
    width: "1.5rem",
    height: "1.5rem",
  },
}));

function Main() {
  const classes = useStyles();
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      history.push("/");
      return;
    }
    document.title = "@" + auth.currentUser.displayName + " · Instagram";

    const unsubscribe = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // every time a new post it added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });
    return unsubscribe;
  }, [history]);

  const uploadComplete = () => {
    setOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const signOut = (event) => {
    event.preventDefault();
    setLogout(true);
    setTimeout(() => {
      auth.signOut().then(() => {
        history.push("/");
      });
    }, 1000);
    return true;
  };

  const isGuest = () => {
    return auth.currentUser.email === "test@lge.com";
  }

  return (
    <div className="main">
      {loading && <LoadingTool type="jumper" />}
      <header>
        <button
          className="new_story"
          onClick={
            () => setOpen(true)
            //history.push("/about")
          }
        >
          <NewStoryIcon width="1.5rem" height="1.5rem" fill="#262626" />
        </button>
        <img
          className="logo"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        <button className="avatar" onClick={signOut}>
          <Avatar className={classes.small} src="/broken-image.jpg" />
        </button>
      </header>

      <article className={loading || logout ? "hidden" : ""}>
        <div>
          {posts.map(({ id, post }) => {
            if (isGuest() && post.username !== "instamaster") return false;
            return <Post
              key={id}
              postId={id}
              user={auth.currentUser}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              contentType={post.contentType}
            />
          })}
        </div>
      </article>

      <Modal
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 800,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            {auth.currentUser ? (
              <ImageUploader
                username={auth.currentUser.displayName}
                onComplete={uploadComplete}
              />
            ) : (
              <h3>Sorry you need to Login to upload</h3>
            )}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default Main;
