import "./agreement.css";
import React, { useState, useEffect, useRef } from "react";
import { RiDeleteBin4Line } from "react-icons/ri";
import { useGobalContext } from "./context";
import { FaTimes } from "react-icons/fa";
import UseTemplates from "./UseTemplates";
import writePost from "./writePost";
import updatePost from "./updatePost";
import { signAgreement, viewAgreement } from "./wall";
import { serverTimestamp, toDate } from "firebase/firestore";

function Agreement({
  posts,
  users,
  currentUserName,
  currentUserProfilePic,
  reviewAgreement,
  setReviewAgreement,
  intiReviewAgreement,
  toggle
}) {
  const { openModal, isModalOpen, closeModal } = useGobalContext();
  const [lists, setLists] = useState();
  const [items, setItems] = useState();
  const [userLists, setUserLists] = useState();
  const [agreementPost, setAgreementPost] = useState([{}]);
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [show, setShow] = useState(false);
  const [textArea, setTextArea] = useState();
  const [selectedImgs, setSelectedImgs] = useState([]);
  const inputRef = useRef(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState(false);
  const [toggleType, setToggleType] = useState("");

  useEffect(() => {
    setItems(
      posts.map((item) => {
        return {
          itemId: item.id,
          itemName: item.name,
          itemMessage: item.message,
          itemImageURL: item.imageURL,
          itemTimestamp: item.timestamp,
          itemSign1Id: item.sign1Id,
          itemSign1Status: item.sign1Status,
          itemSign2Id: item.sign2Id,
          itemSign2Status: item.sign2Status,
          itemAgreementImgs: item.agreementImgs,
          itemType: item.type
        };
      })
    );
  }, [posts]);
  // console.log("items:", items, typeof(items));

  useEffect(() => {
    setUserLists(
      users.map((user) => {
        return {
          userId: user.id,
          userName: user.name
        };
      })
    );
  }, [users]);

  useEffect(() => {
    setLists();
    if (intiReviewAgreement === true) {
      setAgreementPost(
        items.filter((item) => {
          if (
            item.itemType === "agreement" &&
            item.itemMessage === reviewAgreement[0]
          ) {
            return true;
          }
        })
      );
    }
  }, [toggle, items, intiReviewAgreement]);

  console.log("agreementPost: ", agreementPost);

  const [agreementItems] = agreementPost;
  // console.log("agreementPost: ", agreementPost);
  // console.log("reviewAgreement: ", reviewAgreement)
  // console.log("toggle: ", toggle);

  const toggleAgreement = () => {
    setShow(!show);
    setStep1(true);
    setStep2(false);
    setStep3(false);
    setToggleType("agreement");
  };

  const handleStep1 = () => {
    setStep1(true);
    setStep2(false);
    setStep3(false);
  };

  const handleStep2 = () => {
    setStep1(false);
    setStep2(true);
    setStep3(false);
  };

  const handleStep3 = () => {
    setStep1(false);
    setStep2(false);
    setStep3(true);
  };

  const selectImages = () => {
    setReviewAgreement(false);
    openModal();
    setLists(items);
  };

  const getURLs = (url) => {
    if (selectedImgs.find((item) => item === url)) {
      const newImageURLs = selectedImgs.filter((item) => item !== url);
      setSelectedImgs(newImageURLs);
    } else selectedImgs.push(url);
  };
  //console.log("selectedImgs: ", selectedImgs);

  const handleDigitalSignature = (check) => {
    console.log("digital signature" + String(check));
    setDigitalSignature(check);
  };

  const submitAgreement = (e) => {
    e.preventDefault();
    setShow(false);
    writePost(
      "agreement",
      textArea,
      currentUserName,
      currentUserProfilePic,
      null,
      userLists[0].userName,
      "Pending",
      userLists[1].userName,
      "Pending",
      selectedImgs,
      digitalSignature
    );
    setTextArea("");
    setSelectedImgs([]);
    setDigitalSignature(false);
  };

  let aPhotoURL;
  let transactionHash = null;
  const acceptAgreement = async (e) => {
    e.preventDefault();
    console.log("accepting");
    let currentSign1Status =
      reviewAgreement[1] === currentUserName ? "Accepted" : reviewAgreement[2];
    let currentSign2Status =
      reviewAgreement[3] === currentUserName ? "Accepted" : reviewAgreement[4];
    const currentTimestamp = serverTimestamp();
    updatePost(
      reviewAgreement[5],
      currentSign1Status,
      currentSign2Status,
      currentTimestamp,
      null
    );
    console.log("digital signature" + String(reviewAgreement[6]));
    closeModal();
    //console.log("lenght: ", agreementItems.itemAgreementImgs.length)
    if (
      currentSign1Status === "Accepted" &&
      currentSign2Status === "Accepted" &&
      reviewAgreement[6]
    ) {
      console.log("agrement img" + agreementItems.itemAgreementImgs);
      aPhotoURL = agreementItems.itemAgreementImgs[0];
      for (let i = 1; i < agreementItems.itemAgreementImgs.length; i++) {
        const add = agreementItems.itemAgreementImgs[i];
        aPhotoURL = ` ${aPhotoURL} +  ${add}  `;
      }
      aPhotoURL = aPhotoURL ? aPhotoURL : "";
      //aPhotoURL = agreementItems.itemAgreementImgs[0];
      //aPhotoURL = agreementPost[0].itemAgreementImgs[0];
      const agreementOther =
        " " +
        reviewAgreement[1] +
        " and " +
        reviewAgreement[3] +
        " have executed this agreement on R.E.solved.";

      var ag1 = {
        aDate: Date(currentTimestamp),
        aAgreement: reviewAgreement[0],
        aPhoto: aPhotoURL,
        aOtherData: agreementOther
      };
      console.log("aphotoURL: ", aPhotoURL);
      transactionHash = await signAgreement(0, ag1);
      console.log("transaction hash:", transactionHash);
      updatePost(
        reviewAgreement[5],
        currentSign1Status,
        currentSign2Status,
        currentTimestamp,
        transactionHash
      );
    }
    // closeModal() is shifted to before writing to blockchain
    // otherwise overlay remains while user waits for write to
    // blockchain completion and will be confused by it and likely
    // will re-click again resulting in second wrtie to blockchain
    //closeModal();
  };

  const rejectAgreement = (e) => {
    e.preventDefault();
    console.log("rejecting");
    let currentSign1Status =
      reviewAgreement[1] === currentUserName ? "Rejected" : reviewAgreement[2];
    let currentSign2Status =
      reviewAgreement[3] === currentUserName ? "Rejected" : reviewAgreement[4];
    const currentTimestamp = serverTimestamp();

    updatePost(
      reviewAgreement[5],
      currentSign1Status,
      currentSign2Status,
      currentTimestamp,
      null
    );
    closeModal();
  };

  const deleteAccepter = (id) => {
    if (userLists.length > 2) {
      const newLists = userLists.filter((list) => list.userId !== id);
      setUserLists(newLists);
    }
  };

  const tryTemplates = () => {
    setShowTemplates(!showTemplates);
  };

  return (
    <div className={`${show ? "agreement" : ""}`}>
      <button className="agreement-btn" onClick={toggleAgreement}>
        Agreement
      </button>{" "}
      <br />
      <br />
      <br />
      {show && (
        <div>
          <button
            className={step1 ? "active-step" : "step"}
            onClick={handleStep1}
          >
            Step 1
          </button>
          <button
            className={step2 ? "active-step" : "step"}
            onClick={handleStep2}
          >
            Step 2
          </button>
          <button
            className={step3 ? "active-step" : "step"}
            onClick={handleStep3}
          >
            Step 3
          </button>
        </div>
      )}
      {show && step1 && (
        <div style={{ display: "block" }}>
          {" "}
          <br />
          {!showTemplates && (
            <form onSubmit={submitAgreement} id="form1" method="get">
              <label htmlFor="msg">
                <span>Summarise the {toggleType}</span>
              </label>{" "}
              <br />
              <textarea
                name="message"
                rows="13"
                cols="41"
                required
                autoComplete="off"
                ref={inputRef}
                onChange={(e) => setTextArea(e.target.value)}
                value={textArea}
              ></textarea>{" "}
              <br />{" "}
              <input type="submit" value="submit" style={{ display: "none" }} />
              <br />
            </form>
          )}
          {showTemplates && <UseTemplates />}
          <button
            style={{
              border: "1px solid #5e5ce6",
              color: "#5e5ce6",
              width: "150px",
              backgroundColor: "white"
              // borderColor: "blue"
            }}
            className="prev"
            onClick={tryTemplates}
          >
            {" "}
            Try templates{" "}
          </button>
          <button className="next" onClick={() => handleStep2()}>
            Next{" "}
          </button>
        </div>
      )}
      {show && step2 && (
        <div>
          {" "}
          <br /> Select images associated with this {toggleType} <br />
          <button
            style={{
              backgroundColor: "#bf5af2",
              width: "100px",
              height: "20px",
              fontSize: "10px",
              paddingBottom: "18px",
              paddingTop: "4px"
            }}
            onClick={selectImages}
          >
            Select
          </button>{" "}
          <br /> <br />
          {selectedImgs.length !== 0 && <p>your selected images:</p>}
          {!isModalOpen && (
            <div style={{ display: "flex", marginLeft: "6%" }}>
              {selectedImgs.map((url, index) => {
                return (
                  <div>
                    s{" "}
                    <img
                      src={url}
                      key={index}
                      alt="user selected"
                      height="50"
                      style={{ margin: "7px" }}
                    />
                  </div>
                );
              })}{" "}
            </div>
          )}
          <button className="prev" onClick={() => handleStep1()}>
            Previous
          </button>
          <button className="next" onClick={() => handleStep3()}>
            Next
          </button>
        </div>
      )}
      {show && step3 && (
        <div>
          {" "}
          <br /> Choose 2 users to execute this {toggleType}?
          <br />
          <div style={{ marginTop: "1rem" }}>
            {userLists &&
              userLists.map((list) => {
                const { userId, userName } = list;

                return (
                  <div key={userId}>
                    <div
                      style={{
                        display: "flex",
                        margin: "2%",
                        color: "white"
                      }}
                    >
                      <p
                        style={{
                          textAlign: "left",
                          margin: "3%",
                          padding: "1px",
                          borderRadius: "4px"
                        }}
                      >
                        {userName}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "auto",
                          marginRight: "10%"
                        }}
                      >
                        <RiDeleteBin4Line
                          onClick={() => deleteAccepter(userId)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <br /> Review {toggleType} text and images then send when ready
          <br />
          <br />
          <div
            style={{
              display: "flex",
              marginLeft: "2%",
              marginRight: "2%",
              border: "0.5px solid grey",
              backgroundColor: "#fcf9f9",
              height: "100px"
            }}
          >
            <p
              style={{
                textAlign: "left",
                marginLeft: "2%",
                marginTop: "1%",
                color: "black"
              }}
            >
              {textArea}
              <br />
              {selectedImgs.map((url, index) => {
                return (
                  <img
                    src={url}
                    key={index}
                    alt="user selected"
                    height="50"
                    style={{ margin: "10px" }}
                  />
                );
              })}{" "}
            </p>
          </div>
          <label>
            <input
              style={{ margin: "2%", marginTop: "2%" }}
              onChange={(e) => {
                handleDigitalSignature(e.target.checked);
              }}
              type="checkbox"
            />
            <span>Add digital signature?</span>
          </label>
          <br />
          <button className="prev" onClick={() => handleStep2()}>
            Previous
          </button>
          <button
            className="prev"
            style={{
              border: "1px solid #5e5ce6",
              color: "white",
              width: "150px",
              backgroundColor: "#5e5ce6"
              // borderColor: "blue"
            }}
            type="submit"
            form="form1"
          >
            Send
          </button>
          <form method="get" id="form1" onSubmit={submitAgreement} />
        </div>
      )}
      {/* modal view  content */}
      <div
        className={`${
          isModalOpen ? "modal-overlay show-modal" : "modal-overlay"
        }`}
      >
        <div className="modal-container">
          <button onClick={closeModal} className="close-modal-btn">
            <FaTimes />
          </button>

          {/* image gallery where user select photo */}
          <div className="select-message">
            {lists &&
              lists.map((list) => {
                const { itemId, itemImageURL } = list;

                return (
                  <div key={itemId} className="image-container">
                    {itemImageURL !== undefined && (
                      <img
                        src={itemImageURL}
                        alt="posted"
                        width="115px"
                        className="image"
                        onClick={() => getURLs(itemImageURL)}
                      />
                    )}
                  </div>
                );
              })}
          </div>

          {/* user review agreement */}
          {reviewAgreement && (
            <div className="review-agreement">
              <h3>Please accept or reject this agreement</h3>
              <p style={{ textAlign: "center" }}>{reviewAgreement[0]}</p>

              {agreementPost.map((item) => {
                const { itemAgreementImgs, itemId } = item;
                return (
                  <div key={itemId}>
                    {itemAgreementImgs &&
                      itemAgreementImgs.map((url) => {
                        return (
                          <img src={url} alt="user selected" height="100" />
                        );
                      })}
                  </div>
                );
              })}

              <button
                style={{
                  backgroundColor: "white",
                  borderColor: "#5e5ce6",
                  color: "#5e5ce6",
                  cursor: "pointer",
                  margin: "6%",
                  borderWidth: "1px"
                }}
                onClick={rejectAgreement}
              >
                Reject
              </button>
              <button onClick={acceptAgreement}>Accept</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Agreement;
