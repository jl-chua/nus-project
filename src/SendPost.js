import React, { useState, useRef } from "react";
import { BsImage } from "react-icons/bs";
import db from "./firebase";
import storage from "./firebase";
import {
  getStorage
  //ref,
  //uploadBytesResumable,
  //getDownloadURL
} from "firebase/storage";
//import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import writePost from "./writePost";

const SendPost = ({ currentUserName, currentUserProfilePic }) => {
  const inputRef = useRef(null);
  const chosenFile = useRef("");
  const [image, setImage] = useState(null);
  const storage = getStorage();

  // get file from user
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const cancelImage = () => {
    setImage();
    chosenFile.current.value = "";
  };

  // post message
  const sendPost = (e) => {
    e.preventDefault();
    writePost(
      "chat",
      inputRef.current.value,
      currentUserName,
      currentUserProfilePic,
      image,
      null,
      null,
      null,
      null,
      null,
      false
    );
    setImage();
    chosenFile.current.value = "";
    inputRef.current.value = "";
  };

  return (
    <div>
      <form style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            style={{
              width: "300px",
              height: "30px",
              border: "none",
              backgroundColor: "var(--clr-grey-10)"
            }}
            type="text"
            id="post"
            name="post"
            ref={inputRef}
            placeholder={"...say something new!"}
          />
          <button style={{ display: "none" }} onClick={sendPost}>
            Post Message
          </button>
        </div>
      </form>

      <br />

      <div className="inputIcon">
        <input type="file" ref={chosenFile} onChange={handleChange} />
        {chosenFile.current.value !== "" && (
          <button
            style={{
              backgroundColor: "white",
              fontFamily: "Arial",
              color: "#3a3a3c",
              width: "120px",
              fontSize: "10px",
              borderRadius: "4px",
              paddingBottom: "0.5px",
              paddingTop: "0.5px",
              boxShadow: "0px 0.5px 1px #505050"
            }}
            onClick={cancelImage}
          >
            Cancel Image Chosen
          </button>
        )}
      </div>
    </div>
  );
};

export default SendPost;
