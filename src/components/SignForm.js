import React, { useState } from "react";
import "./SignForm.css";
import { makeStyles } from "@material-ui/core";
import {
  Button,
  createTheme,
  TextField,
  ThemeProvider,
} from "@material-ui/core";
import { auth, db } from "../firebase";
import instagramlogo from "../assets/img/instagramlogo.png";

const theme = createTheme({
  overrides: {
    MuiInputLabel: {
      root: {
        color: "rgba(0, 0, 0, 0.4)",
      },
    },
  },
});

const useStyles = makeStyles(() => ({
  button: {
    margin: "1.5rem 0 1rem",
  },
}));

function SignForm({ type, setOpen }) {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const signUp = (event) => {
    event.preventDefault();
    db.collection("users")
      .where("username", "==", username)
      .get()
      .then((querySnapshot) => {
        console.log("query username");
        if (querySnapshot.size === 0) {
          auth
            .createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
              setOpen(false);
              return authUser.user
                .updateProfile({
                  displayName: username,
                })
                .then(() => {
                  db.collection("users").doc(email).set({
                    username: username,
                  });
                });
            })
            .catch((error) => {
              alert(error.message);
            });
        } else {
          alert("The username already exists. Please use a different username");
        }
      });
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setOpen(false);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <form className="signform">
        <center>
          <img className="signform__header_img" src={instagramlogo} alt="" />
        </center>
        {type === 2 && (
          <TextField
            label="username"
            type="search"
            variant="outlined"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <TextField
          label="email"
          type="email"
          variant="outlined"
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="password"
          type="password"
          variant="outlined"
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {type === 1 ? (
          <Button className={classes.button} type="submit" onClick={signIn}>
            <strong>Sign In</strong>
          </Button>
        ) : (
          <Button className={classes.button} type="submit" onClick={signUp}>
            <strong>Sign Up</strong>
          </Button>
        )}
      </form>
    </ThemeProvider>
  );
}

export default SignForm;
