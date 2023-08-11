import React from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile({ viewProfile, setViewProfile }) {
  const navigate = useNavigate();

  function handleMouseOver() {
    setViewProfile(true);
  }

  function handleMouseOut() {
    setViewProfile(false);
  }
  return (
    <div>
      {viewProfile && (
        <div
          className="profile"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <p> Account </p>
          <p onClick={() => navigate("/orders")}> Orders </p>
        </div>
      )}
    </div>
  );
}

export default Profile;
