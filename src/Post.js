import "./post.css";
import React, { useState } from "react";
import { useGobalContext } from "./context";
import Agreement from "./Agreement";
import SendPost from "./SendPost";
//import { doc, updateDoc, serverTimestamp, toDate } from "firebase/firestore";

const Post = ({ posts, users, currentUserName, currentUserProfilePic }) => {
  const { openModal } = useGobalContext();
  const [show, setShow] = useState(false);
  const [buttonMsg, setButtonMsg] = useState("Select");
  //const [addToAgreement, setAddToAgreement] = useState([]);
  const [checkboxData, setCheckboxData] = useState([]);
  const [reviewAgreement, setReviewAgreement] = useState(false);
  const [intiReviewAgreement, setIntiReviewAgreement] = useState(false);
  const [toggle, setToggle] = useState(true);
  //const [displayDate, setDisplayDate] = useState(0);
  //const [displayDateTime, setDisplayDateTime] = useState();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let match;
  let cancelMatch;
  let displayDateTime;

  const handleSelectBtn = () => {
    setShow(!show);
    if (!show) {
      setButtonMsg("cancel");
      setCheckboxData([]);
    } else setButtonMsg("select Message");
  };

  const handleCheck = (dataIn, dataOut) => {
    if (!dataOut) {
      checkboxData.push(dataIn);
      //console.log("in:", checkboxData);
    }
    if (dataOut) {
      const newData = checkboxData.filter((data) => data.id !== dataOut.id);
      setCheckboxData(newData);
    }
  };

  // console.log("out", checkboxData);

  const handleAddToAgreement = () => {
    setShow(!show);
    //console.log("add to: ", checkboxData);
    // some code to write to blockchain

    //setAddToAgreement(checkboxData)
    setCheckboxData([]);
    setButtonMsg("select Message");
    //console.log("added: ",addToAgreement)
  };

  const handleReview = (agreement) => {
    setIntiReviewAgreement(true);
    setToggle(!toggle);
    openModal();
    setReviewAgreement(agreement);
    console.log("handle review " + agreement);
  };

  const handleDisplayDateTime = (ts) => {
    displayDateTime = new Date(ts?.toDate());
    return (
      displayDateTime.getDate() +
      " " +
      months[displayDateTime.getMonth()] +
      " " +
      displayDateTime.getHours() +
      ":" +
      displayDateTime.getMinutes()
    );
  };

  return (
    <div className="post">
      <div
        // style={{
        //   display: "flex",
        //   margin: "0%",
        //   justifyContent: "space-evenly",
        //   backgroundColor: "var(--clr-grey-5)"
        // }}
        className="post-header"
      >
        {show && (
          <button onClick={handleAddToAgreement}> Add to agreement</button>
        )}
        <button onClick={handleSelectBtn}> {buttonMsg} </button>
      </div>
      {posts.map((post) => {
        const {
          id,
          avatar,
          message,
          imageURL,
          type,
          sign1Id,
          sign1Status,
          sign2Id,
          sign2Status,
          timestamp,
          agreementImgs,
          digitalSignature,
          transactionHash
        } = post;

        return (
          <div key={id + 1} className="post-msg">
            <div className="hor-div">
              {show && (
                <input
                  style={{ margin: "2%", marginTop: "6%" }}
                  onChange={(e) => {
                    const check = e.target.checked;
                    if (check) {
                      match = { id, message };
                    } else if (!check) {
                      cancelMatch = { id, message };
                    }
                    const fn = () => {
                      handleCheck(match, cancelMatch);
                    };
                    fn();
                  }}
                  type="checkbox"
                />
              )}

              <img
                alt="user"
                src={avatar}
                height="50"
                style={{ margin: "2%" }}
              />

              {message && <div className="post-text">{message}</div>}
            </div>

            {imageURL !== undefined && (
              <img
                alt="imageURL"
                src={imageURL}
                width="200"
                style={{ margin: "2% 0% 0% 0%", alignItems: "left" }}
              />
            )}

            {type === "agreement" &&
              agreementImgs !== undefined &&
              agreementImgs.map((url, index) => {
                return (
                  <img
                    src={url}
                    key={index}
                    alt="agreementImgs"
                    width="200"
                    style={{ margin: "2% 0% 0% 0%", alignItems: "left" }}
                  />
                );
              })}

            {type === "agreement" && (
              <p>
                <label
                  style={{
                    color: "#3a3a3c",
                    fontSize: "10px"
                  }}
                >
                  ( {sign1Id} {sign1Status} ) ( {sign2Id} {sign2Status} )
                </label>{" "}
                {((sign1Id === currentUserName && sign1Status === "Pending") ||
                  (sign2Id === currentUserName && sign2Status === "Pending")) &&
                  sign1Status !== "Rejected" &&
                  sign2Status !== "Rejected" && (
                    <button
                      style={{
                        backgroundColor: "#5e5ce6",
                        borderRadius: "50px",
                        fontSize: "10px",
                        height: "8px",
                        width: "90px",
                        cursor: "pointer",
                        paddingBottom: "16px",
                        paddingTop: "2px",
                        marginLeft: "30px"
                      }}
                      onClick={() =>
                        handleReview([
                          message,
                          sign1Id,
                          sign1Status,
                          sign2Id,
                          sign2Status,
                          id,
                          digitalSignature
                        ])
                      }
                    >
                      Review Agreement
                    </button>
                  )}
                {transactionHash && (
                  <a
                    href={"https://ropsten.etherscan.io/tx/" + transactionHash}
                    target="_blank"
                  >
                    click to view digital signature
                  </a>
                )}
              </p>
            )}

            <p
              style={{
                color: "lightgrey",
                fontSize: "75%",
                marginTop: "0",
                marginBottom: "4%"
              }}
            >
              {handleDisplayDateTime(timestamp)}
            </p>
          </div>
        );
      })}
      <SendPost
        currentUserName={currentUserName}
        currentUserProfilePic={currentUserProfilePic}
      />

      <br />
      <Agreement
        posts={posts}
        users={users}
        currentUserName={currentUserName}
        currentUserProfilePic={currentUserProfilePic}
        reviewAgreement={reviewAgreement}
        setReviewAgreement={setReviewAgreement}
        intiReviewAgreement={intiReviewAgreement}
        toggle={toggle}
      />
    </div>
  );
};

export default Post;
