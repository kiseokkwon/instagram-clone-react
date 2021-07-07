import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import Avatar from "@material-ui/core/Avatar";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openNewStory, setOpenNewStory] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        setUser(authUser);
        document.title = '@' + authUser.displayName + ' · Instagram';
      } else {
        // user has logged out...
        setUser(null);
        document.title = 'Instagram';
      }
      setAuthChecked(true);
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    // this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a new post it added, this code fires...
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    db.collection('users').where('username', "==", username).get().then(querySnapshot => {
      console.log("query username");
      if (querySnapshot.size === 0) {
        auth
          .createUserWithEmailAndPassword(email, password)
          .then((authUser) => {
            setOpen(false);
            console.log("createUser then");
            return authUser.user.updateProfile({
              displayName: username
            }).then(() => {
              setUser(authUser);
              db.collection('users').doc(email).set({
                username: username
              });
              console.log("dbset then");
            });
          })
          .catch((error) => {
            alert(error.message);
            clearAll();
          });
      } else {
        alert('The username already exists. Please use a different username');
      }
    });
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => setOpenSignIn(false))
      .catch((error) => {
        alert(error.message);
      });
  };

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        alert('You have been logged out successfully');
        clearAll();
      });
  };

  const closeSignUp = () => {
    setOpen(false);
    clearAll();
  };

  const closeSignIn = () => {
    setOpenSignIn(false);
    clearAll();
  };

  const clearAll = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setUser(null);
  };

  const uploadComplete = () => {
    setOpenNewStory(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      {/* <span>
        <svg className="app__loading" width="50" height="50" viewBox="0 0 50 50">
          <path d="M25 1c-6.52 0-7.34.03-9.9.14-2.55.12-4.3.53-5.82 1.12a11.76 11.76 0 0 0-4.25 2.77 11.76 11.76 0 0 0-2.77 4.25c-.6 1.52-1 3.27-1.12 5.82C1.03 17.66 1 18.48 1 25c0 6.5.03 7.33.14 9.88.12 2.56.53 4.3 1.12 5.83a11.76 11.76 0 0 0 2.77 4.25 11.76 11.76 0 0 0 4.25 2.77c1.52.59 3.27 1 5.82 1.11 2.56.12 3.38.14 9.9.14 6.5 0 7.33-.02 9.88-.14 2.56-.12 4.3-.52 5.83-1.11a11.76 11.76 0 0 0 4.25-2.77 11.76 11.76 0 0 0 2.77-4.25c.59-1.53 1-3.27 1.11-5.83.12-2.55.14-3.37.14-9.89 0-6.51-.02-7.33-.14-9.89-.12-2.55-.52-4.3-1.11-5.82a11.76 11.76 0 0 0-2.77-4.25 11.76 11.76 0 0 0-4.25-2.77c-1.53-.6-3.27-1-5.83-1.12A170.2 170.2 0 0 0 25 1zm0 4.32c6.4 0 7.16.03 9.69.14 2.34.11 3.6.5 4.45.83 1.12.43 1.92.95 2.76 1.8a7.43 7.43 0 0 1 1.8 2.75c.32.85.72 2.12.82 4.46.12 2.53.14 3.29.14 9.7 0 6.4-.02 7.16-.14 9.69-.1 2.34-.5 3.6-.82 4.45a7.43 7.43 0 0 1-1.8 2.76 7.43 7.43 0 0 1-2.76 1.8c-.84.32-2.11.72-4.45.82-2.53.12-3.3.14-9.7.14-6.4 0-7.16-.02-9.7-.14-2.33-.1-3.6-.5-4.45-.82a7.43 7.43 0 0 1-2.76-1.8 7.43 7.43 0 0 1-1.8-2.76c-.32-.84-.71-2.11-.82-4.45a166.5 166.5 0 0 1-.14-9.7c0-6.4.03-7.16.14-9.7.11-2.33.5-3.6.83-4.45a7.43 7.43 0 0 1 1.8-2.76 7.43 7.43 0 0 1 2.75-1.8c.85-.32 2.12-.71 4.46-.82 2.53-.11 3.29-.14 9.7-.14zm0 7.35a12.32 12.32 0 1 0 0 24.64 12.32 12.32 0 0 0 0-24.64zM25 33a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm15.68-20.8a2.88 2.88 0 1 0-5.76 0 2.88 2.88 0 0 0 5.76 0z" />
        </svg>
      </span> */}
      {
        (authChecked && !user?.displayName) && <div className="app__login">
          <Modal
            open={open}
            onClose={closeSignUp}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app__signup">
                <center>
                  <img
                    className="app__headerImage"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                  />
                </center>
                <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={signUp}>Sign Up</Button>
              </form>
            </div>
          </Modal>

          <Modal
            open={openSignIn}
            onClose={closeSignIn}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app__signup">
                <center>
                  <img
                    className="app__headerImage"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                  />
                </center>
                <Input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={signIn}>Sign In</Button>
              </form>
            </div>
          </Modal>
          <main>
            <img
              className="app__loginImage"
              src="data:image/png;base64,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"
              alt=""
            />
            <h5>친구들의 사진과 동영상을 보려면 가입하세요.</h5>
            <h5><span onClick={() => setOpenSignIn(true)}>로그인</span> 또는 <span onClick={() => setOpen(true)}>가입하기</span></h5>
          </main>
          <footer>
            <h6>from</h6>
            <h3>LG Electronics</h3>
          </footer>
        </div>
      }
      {
        (authChecked && user?.displayName) && <div className="app__main">
          <Modal
            open={openNewStory}
            onClose={() => setOpenNewStory(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              {
                user?.displayName ? (
                  <ImageUpload username={user.displayName} onComplete={uploadComplete} />
                ) : (
                  <h3>Sorry you need to Login to upload</h3>
                )
              }
            </div>
          </Modal>

          <div className="app__header">
            <button className="app__headerNewButton" onClick={() => setOpenNewStory(true)}>
              <svg aria-label="새 스토리" className="_8-yf5 " fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                <path d="M38.5 46h-29c-5 0-9-4-9-9V17c0-5 4-9 9-9h1.1c1.1 0 2.2-.6 2.7-1.7l.5-1c1-2 3.1-3.3 5.4-3.3h9.6c2.3 0 4.4 1.3 5.4 3.3l.5 1c.5 1 1.5 1.7 2.7 1.7h1.1c5 0 9 4 9 9v20c0 5-4 9-9 9zm6-29c0-3.3-2.7-6-6-6h-1.1C35.1 11 33 9.7 32 7.7l-.5-1C31 5.6 29.9 5 28.8 5h-9.6c-1.1 0-2.2.6-2.7 1.7l-.5 1c-1 2-3.1 3.3-5.4 3.3H9.5c-3.3 0-6 2.7-6 6v20c0 3.3 2.7 6 6 6h29c3.3 0 6-2.7 6-6V17zM24 38c-6.4 0-11.5-5.1-11.5-11.5S17.6 15 24 15s11.5 5.1 11.5 11.5S30.4 38 24 38zm0-20c-4.7 0-8.5 3.8-8.5 8.5S19.3 35 24 35s8.5-3.8 8.5-8.5S28.7 18 24 18z"></path>
              </svg>
            </button>
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
            <button className="app__headerAvatar" onClick={signOut}>
              <Avatar className={classes.small} src="/broken-image.jpg" />
            </button>
          </div>

          <div className="app__posts">
            <div className="app__postsLeft">
              {
                posts.map(({ id, post }) => (
                  <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} contentType={post.contentType} />
                ))
              }
            </div>
          </div>
        </div>
      }
    </div>
  );
}
export default App;
