import React from "react";

function ChangeUser({
  handleUserId,
  currentUserName,
  currentUserId,
  profilePic
}) {
  let inputNum;

  return (
    <div className="changeuser">
      <div style={{ marginTop: "1rem", boxShadow: "5px 10px #888888t" }}>
        <label>change user by userID - </label>
        <input onChange={(e) => (inputNum = e.target.value)} />
      </div>

      <button onClick={() => handleUserId(inputNum)}> Enter </button>

      <br />

      <div style={{ backgroundColor: "lightgrey", marginTop: "1rem" }}>
        <img
          style={{ marginTop: "3%" }}
          alt="pic-profile"
          src={profilePic}
          height="50"
          width="50"
        />

        <br />

        {currentUserName}
        <p style={{ padding: "2%", marginTop: "0" }}>id: {currentUserId}</p>
      </div>
    </div>
  );
}

export default ChangeUser;
