import React from "react";
import "./NavBar.css";

function NavBar() {
  const handleBack = () => {
    document.location.href = "http://localhost:8765";
  };

  const handleHome = () => {
    document.location.href = "http://localhost:8765";
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <nav className="navbar">
        <div onClick={handleBack}>
          <span class="material-icons-outlined">arrow_back_ios</span>
        </div>
        <div onClick={handleHome}>
          <span class="material-icons-outlined">home</span>
        </div>
        <div>
          <span class="material-icons-outlined">notifications</span>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
