import "./ImageUploader.css";
import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import firebase from "firebase/app";
import { db, storage } from "../firebase";

const useStyles = makeStyles(() => ({
  button: {
    marginTop: "1.5rem",
  },
}));

function ImageUploader({ username, onComplete }) {
  const classes = useStyles();
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleUpload = () => {
    if (!image) {
      alert("이미지를 선택해 주세요.");
      return;
    }
    storage
      .ref(`images/${image.name}`)
      .put(image)
      .on(
        "state_changed",
        (snapshot) => {
          // progress function ...
          console.log(snapshot);
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Error function ...
          console.log(error);
          alert(error.message);
          onComplete();
        },
        () => {
          // complete function ...
          storage
            .ref("images")
            .child(image.name)
            .getMetadata()
            .then((metadata) => {
              var type = metadata.contentType;
              console.log(type);
              storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                  // post image inside db
                  db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: url,
                    contentType: type,
                    username: username,
                  });

                  setProgress(0);
                  setCaption("");
                  setImage(null);
                  onComplete();
                });
            });
        }
      );
  };

  return (
    <div className="imageuploader">
      <div className="imageuploader__title">
        <strong>새 게시물</strong>
      </div>
      <div className="imageuploader__previewContainer">
        {!image && (
          <span className="imageuploader__placeholder">이미지 없음</span>
        )}
        {image && (
          <img
            className="imageuploader__preview"
            src={image ? URL.createObjectURL(image) : null}
            alt="preview"
          />
        )}
      </div>
      {progress > 0 && (
        <progress
          className="imageuploader__progress"
          value={progress}
          max="100"
        />
      )}
      <textarea
        className="imageuploader__caption"
        placeholder="Enter a caption..."
        rows="4"
        onChange={(event) => {
          console.log("original", caption);
          var txt = event.target.value
          console.log("change", txt.replace(/\r\n?|\n/g, '<br />'));
          setCaption(txt);
        }}
        value={caption}
      ></textarea>
      <input
        className="imageuploader__loader"
        type="file"
        onChange={handleChange}
      />
      <Button className={classes.button} type="submit" onClick={handleUpload}>
        <strong>Upload</strong>
      </Button>
    </div>
  );
}

export default ImageUploader;
