import React, { useState, useEffect } from "react";
import "./Post.css";
import { db } from "../firebase";
import firebase from "firebase/app";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core";
import { ReactComponent as LikeIcon } from "../assets/img/like.svg";
import { ReactComponent as UnlikeIcon } from "../assets/img/unlike.svg";
import { ReactComponent as ReplyIcon } from "../assets/img/reply.svg";
import { ReactComponent as ShareIcon } from "../assets/img/share.svg";
import { ReactComponent as SaveIcon } from "../assets/img/save.svg";

const useStyles = makeStyles(() => ({
  small: {
    width: "1.5rem",
    height: "1.5rem",
    marginRight: "0.625rem",
    fontSize: "1rem",
  },
}));

function Post({ postId, user, username, caption, imageUrl, contentType }) {
  const classes = useStyles();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [favoriteCnt, setFavoriteCnt] = useState(0);

  useEffect(() => {
    // update comments
    const unsubscribe = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            comment: doc.data(),
          }))
        );
      });
    return unsubscribe;
  }, [postId]);

  useEffect(() => {
    // update favorite
    const unsubscribe = db
      .collection("posts")
      .doc(postId)
      .collection("favorites")
      .onSnapshot((snapshot) => {
        setFavoriteCnt(snapshot.size);
        let isFavorite = false;
        snapshot.docs.forEach((doc) => {
          if (doc.id === user.email) {
            isFavorite = true;
          }
        });
        setFavorite(isFavorite);
      });
    return unsubscribe;
  }, [postId, user]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  const toggleFavorite = (event) => {
    event.preventDefault();
    const favoriteUserRef = db
      .collection("posts")
      .doc(postId)
      .collection("favorites")
      .doc(user.email);
    if (favorite) {
      favoriteUserRef.delete();
    } else {
      favoriteUserRef.set({});
    }
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className={classes.small}
          alt={username.toUpperCase()}
          src="/static/image/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      {String(contentType).includes("video") ? (
        <video
          className="post__image"
          autoPlay
          controls
          muted
          src={imageUrl}
          type={String(contentType)}
        />
      ) : (
        <img className="post__image" src={imageUrl} alt="" />
      )}
      <div className="post__body">
        <section className="ltpMr  Slqrh">
          <span className="iconlike">
            <button
              className="post__buttonIcon"
              value={favorite}
              onClick={toggleFavorite}
            >
              {favorite ? (
                <LikeIcon fill="#ed4956" height="1.5rem" width="1.5rem" />
              ) : (
                <UnlikeIcon fill="#262626" height="1.5rem" width="1.5rem" />
              )}
            </button>
          </span>

          <span className="iconcomment">
            <button className="post__buttonIcon">
              <ReplyIcon fill="#262626" height="1.5rem" width="1.5rem" />
            </button>
          </span>

          <span className="iconshare">
            <button className="post__buttonIcon">
              <ShareIcon fill="#262626" height="1.5rem" width="1.5rem" />
            </button>
          </span>

          <span className="iconsave">
            <button className="post__buttonIcon">
              <SaveIcon fill="#262626" height="1.5rem" width="1.5rem" />
            </button>
          </span>
        </section>

        <h4 className="post__likeCount">
          <strong>좋아요 {favoriteCnt}개</strong>
        </h4>

        <h4 className="post__text">
          <strong>{username}</strong> {caption}
        </h4>

        <div className="post__comments">
          {comments.map(({ id, comment }) => (
            <p key={id}>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>
      </div>
      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
