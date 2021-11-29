//import React, { useState, useRef } from "react";

import db from "./firebase";

import storage from "./firebase";
import collectionName from "./collectionName";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const updatePost = (
  currentId,
  currentSign1Status,
  currentSign2Status,
  currentTimestamp,
  currentTransactionHash
) => {
  const docRef = updateDoc(doc(db, collectionName, currentId), {
    sign1Status: currentSign1Status,
    sign2Status: currentSign2Status,
    timestamp: currentTimestamp,
    transactionHash: currentTransactionHash
  });
};

export default updatePost;
