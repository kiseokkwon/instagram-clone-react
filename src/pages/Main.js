import React, { useEffect, useState } from "react";
import { Avatar, makeStyles, Modal } from "@material-ui/core";
import ImageUpload from "../components/ImageUpload";
import Post from "../components/Post";
import { auth, db } from "../firebase";
import "./Main.css";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  newpaper: {
    position: "absolute",
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
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
  const [openNewStory, setOpenNewStory] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      history.push("/");
      return;
    }
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
    setOpenNewStory(false);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const signOut = (event) => {
    event.preventDefault();
    setTimeout(() => {
      auth.signOut().then(() => {
        //alert("You have been logged out successfully");
        history.push("/");
      });
    }, 800);
    return true;
  };

  return (
    <div className="main">
      <header>
        <div className="header-container">
          <button
            className="main__headerNewButton"
            onClick={() => history.push("/about")}
          >
            <svg
              aria-label="새 스토리"
              className="_8-yf5 "
              fill="#262626"
              viewBox="0 0 48 48"
              height="1.5rem"
              width="1.5rem"
            >
              <path d="M38.5 46h-29c-5 0-9-4-9-9V17c0-5 4-9 9-9h1.1c1.1 0 2.2-.6 2.7-1.7l.5-1c1-2 3.1-3.3 5.4-3.3h9.6c2.3 0 4.4 1.3 5.4 3.3l.5 1c.5 1 1.5 1.7 2.7 1.7h1.1c5 0 9 4 9 9v20c0 5-4 9-9 9zm6-29c0-3.3-2.7-6-6-6h-1.1C35.1 11 33 9.7 32 7.7l-.5-1C31 5.6 29.9 5 28.8 5h-9.6c-1.1 0-2.2.6-2.7 1.7l-.5 1c-1 2-3.1 3.3-5.4 3.3H9.5c-3.3 0-6 2.7-6 6v20c0 3.3 2.7 6 6 6h29c3.3 0 6-2.7 6-6V17zM24 38c-6.4 0-11.5-5.1-11.5-11.5S17.6 15 24 15s11.5 5.1 11.5 11.5S30.4 38 24 38zm0-20c-4.7 0-8.5 3.8-8.5 8.5S19.3 35 24 35s8.5-3.8 8.5-8.5S28.7 18 24 18z"></path>
            </svg>
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

      <article>
        <div className="main__posts">
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
        </div>
      </article>
      <Modal open={openNewStory} onClose={() => setOpenNewStory(false)}>
        <div className={classes.newpaper}>
          {auth.currentUser ? (
            <ImageUpload
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
