import React, { useEffect, useState } from "react";
import "./Main.css";
import { useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import { Avatar, makeStyles, Modal } from "@material-ui/core";
import ImageUploader from "../components/ImageUploader";
import Post from "../components/Post";
import { ReactComponent as NewStoryIcon } from "../assets/img/newstory.svg";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "18.75rem",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 2),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxSizing: "border-box",
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

  useEffect(() => {
    if (!auth.currentUser) {
      history.push({
        pathname: "/",
        state: { from: history.location.pathname },
      });
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
      });
    return () => {
      unsubscribe();
    };
  }, [history]);

  const uploadComplete = () => {
    setOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const signOut = (event) => {
    event.preventDefault();
    setTimeout(() => {
      auth.signOut().then(() => {
        history.push({
          pathname: "/",
          state: { from: history.location.pathname },
        });
      });
    }, 800);
    return true;
  };

  return (
    <div className="main">
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

      <article>
        <div>
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={auth.currentUser}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              contentType={post.contentType}
            />
          ))}
        </div>
      </article>

      <Modal open={open} onClose={() => setOpen(false)}>
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
      </Modal>
    </div>
  );
}

export default Main;
