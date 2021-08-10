import "./ImageUpload.css";
import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { db, storage } from "../firebase";

function ImageUpload({ username, onComplete }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function ...
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
                    timestamp: db.FieldValue.serverTimestamp(),
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
    }
  };

  return (
    <div className="imageupload">
      <div className="imageupload_previewContainer">
        {image && (
          <img
            className="imageupload__preview"
            src={image ? URL.createObjectURL(image) : null}
            alt="preview"
          />
        )}
      </div>
      {progress > 0 && (
        <progress
          className="imageupload__progress"
          value={progress}
          max="100"
        />
      )}
      <textarea
        className="imageupload__caption"
        placeholder="Enter a caption..."
        rows="4"
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      ></textarea>
      <input type="file" onChange={handleChange} />
      <Button type="submit" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
