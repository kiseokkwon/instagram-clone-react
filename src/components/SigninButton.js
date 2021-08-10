import React from "react";
import { auth, AuthProvider } from "../firebase";
import "./SigninButton.css";

function SigninButton({ type }) {
  const typeMeta = {
    google: {
      background: "#ffffff",
      color: "#757575",
      title: "Sign in with Google",
      titleShort: "Google",
      icon: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
    },
    github: {
      background: "#333333",
      title: "Sign in with GitHub",
      titleShort: "GitHub",
      icon: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg",
    },
    facebook: {
      background: "#3b5998",
      title: "Sign in with Facebook",
      titleShort: "Facebook",
      icon: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg",
    },
  };
  const meta = typeMeta[type];
  const providerMeta = AuthProvider[type];

  const signInWithAnother = () => {
    auth
      .signInWithRedirect(providerMeta.get)
      .then((result) => {})
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className="signinButton">
      <button
        className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-id-idp-button"
        data-provider-id={providerMeta.id}
        style={{ backgroundColor: meta.background }}
        data-upgraded=",MaterialButton"
        onClick={signInWithAnother}
      >
        <span className="firebaseui-idp-icon-wrapper">
          <img className="firebaseui-idp-icon" alt="" src={meta.icon} />
        </span>
        <span
          className="firebaseui-idp-text firebaseui-idp-text-long"
          style={{ color: meta.color }}
        >
          {meta.title}
        </span>
      </button>
    </div>
  );
}

export default SigninButton;
