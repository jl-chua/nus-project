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
  const chosenFile = useRef(null);
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
      null
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
        <button onClick={cancelImage}>Cancel Image Chosen</button>
      </div>
    </div>
  );
};

export default SendPost;
