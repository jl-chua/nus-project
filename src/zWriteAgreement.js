//import React, { useState, useRef } from "react";
import db from "./firebase";
import storage from "./firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const WriteAgreement = (
  currentType,
  currentStatus,
  currentMsg,
  currentUserName,
  currentUserProfilePic,
  currentImg
) => {
  const storage = getStorage();
  console.log("running write post");
  console.log("current img" + currentImg);

  // get file from user
  //const handleChange = (e) => {
  //  if (e.target.files[0]) {
  //    setImage(e.target.files[0]);
  //  }
  //};
  // post message
  //let inputMsg;
  //const sendPost = (e) => {
  //  e.preventDefault();
  if (!currentMsg && !currentImg) return;
  if (!currentImg) {
    console.log("running no image");
    const docRef = addDoc(collection(db, "hello"), {
      type: currentType,
      status: currentStatus,
      message: currentMsg,
      name: currentUserName,
      avatar: currentUserProfilePic,
      timestamp: serverTimestamp()
    });
  } else if (currentImg !== undefined) {
    const storageRef = ref(storage, currentImg.name);
    const uploadTask = uploadBytesResumable(storageRef, currentImg);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },

      (error) => {
        // Handle unsuccessful uploads
      },

      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          const docRef = addDoc(collection(db, "hello"), {
            type: currentType,
            status: currentStatus,
            message: currentMsg,
            name: currentUserName,
            avatar: currentUserProfilePic,
            imageURL: downloadURL,
            timestamp: serverTimestamp()
          });
        });
      }
    );
  }
};

export default WriteAgreement;
