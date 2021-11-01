//import React, { useState, useRef } from "react";

import db from "./firebase";

import storage from "./firebase";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const updatePost = (currentId, currentSign1Status, currentSign2Status) => {
  const docRef = updateDoc(doc(db, "demo", currentId), {
    sign1Status: currentSign1Status,
    sign2Status: currentSign2Status
  });
};

export default updatePost;
