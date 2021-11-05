import React, { useEffect, useState } from "react";
import "./App.css";
//import Button from "react-bootstrap/Button";
import usersData from "./users";
import db from "./firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  toDate
} from "firebase/firestore";
import Post from "./Post";
import ChangeUser from "./ChangeUser";
import collectionName from "./collectionName";

function App() {
  const [users] = useState(usersData);
  const [currentUser, setCurrentUser] = useState({});
  const [profilePic, setProfilePic] = useState("");
  const [posts, setPosts] = useState([{}]);

  let [arrayId, setArrayId] = useState(0);
  let loginUser = users[arrayId];

  // get  real-time db from firestore - https://cloud.google.com/firestore/docs/query-data/listen
  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  }, []);

  // set current user
  useEffect(() => {
    setCurrentUser(loginUser);
    setProfilePic(currentUser.profilePic);
  }, [loginUser, currentUser.profilePic]);

  // change current user
  const handleUserId = (input) => {
    if (input < users.length + 1 && input > 0) {
      setArrayId(parseInt(input, 10) - 1);
    }
  };

  return (
    <div className="App-container">
      <div className="App">
        <ChangeUser
          handleUserId={handleUserId}
          currentUserName={currentUser.name}
          currentUserId={currentUser.id}
          profilePic={profilePic}
        />

        <Post
          posts={posts}
          users={users}
          currentUserName={currentUser.name}
          currentUserProfilePic={profilePic}
        />
      </div>
    </div>
  );
}

export default App;
