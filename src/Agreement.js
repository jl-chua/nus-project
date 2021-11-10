import "./agreement.css";
import React, { useState, useEffect, useRef } from "react";
import { RiDeleteBin4Line } from "react-icons/ri";
import { useGobalContext } from "./context";
import { FaTimes } from "react-icons/fa";
import UseTemplates from "./UseTemplates";
import writePost from "./writePost";
import updatePost from "./updatePost";

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

  // console.log("agreementPost: ", agreementPost);
  // console.log("reviewAgreement: ", reviewAgreement)
  // console.log("toggle: ", toggle);

  const toggleAgreement = () => {
    setShow(!show);
    setStep1(true);
    setStep2(false);
    setStep3(false);
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
      selectedImgs
    );
    setTextArea("");
    setSelectedImgs([]);
  };

  const approveAgreement = (e) => {
    e.preventDefault();
    console.log("approving");
    let currentSign1Status =
      reviewAgreement[1] === currentUserName ? "Approved" : reviewAgreement[2];
    let currentSign2Status =
      reviewAgreement[3] === currentUserName ? "Approved" : reviewAgreement[4];
    updatePost(reviewAgreement[5], currentSign1Status, currentSign2Status);
    closeModal();
    /*
    writePost(
      "agreement",
      // inputRef.current.value,
      reviewAgreement[0],
      currentUserName,
      currentUserProfilePic,
      null,
      reviewAgreement[1],
      currentSign1Status,
      reviewAgreement[3],
      currentSign2Status
    );
    */
  };

  const rejectAgreement = (e) => {
    e.preventDefault();
    console.log("rejecting");
    let currentSign1Status =
      reviewAgreement[1] === currentUserName ? "Rejected" : reviewAgreement[2];
    let currentSign2Status =
      reviewAgreement[3] === currentUserName ? "Rejected" : reviewAgreement[4];
    updatePost(reviewAgreement[5], currentSign1Status, currentSign2Status);
    closeModal();
    /*
    writePost(
      "agreement",
      // inputRef.current.value,
      reviewAgreement[0],
      currentUserName,
      currentUserProfilePic,
      null,
      reviewAgreement[1],
      currentSign1Status,
      reviewAgreement[3],
      currentSign2Status
    );
    */
  };

  const deleteApprover = (id) => {
    const newLists = userLists.filter((list) => list.userId !== id);
    setUserLists(newLists);
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
          <button className="step" onClick={handleStep1}>
            Step 1
          </button>
          <button className="step" onClick={handleStep2}>
            Step 2
          </button>
          <button className="step" onClick={handleStep3}>
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
                <span>Summarise the agreement</span>
              </label>{" "}
              <br />
              <textarea
                name="message"
                rows="10"
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
          <button onClick={tryTemplates}> try templates </button>
          <br />
          <button className="prev-next" onClick={() => handleStep2()}>
            next
          </button>
        </div>
      )}
      {show && step2 && (
        <div>
          {" "}
          <br /> Select images associated with this agreement <br />
          <button onClick={selectImages}>select</button> <br /> <br />
          {selectedImgs.length !== 0 && <p>your selected images:</p>}
          {!isModalOpen && (
            <div style={{ display: "flex", marginLeft: "6%" }}>
              {selectedImgs.map((url, index) => {
                return (
                  <div>
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
          <button className="prev-next" onClick={() => handleStep1()}>
            previous
          </button>
          <button className="prev-next" onClick={() => handleStep3()}>
            next
          </button>
        </div>
      )}
      {show && step3 && (
        <div>
          {" "}
          <br /> Who will approve agreement?
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
                        backgroundColor: "#d3e5e8"
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
                          onClick={() => deleteApprover(userId)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <br /> Review agreement text and images then send when ready
          <br />
          <br />
          <div
            style={{
              display: "flex",
              marginLeft: "2%",
              marginRight: "2%",
              border: "1px solid black",
              backgroundColor: "lightgreen"
            }}
          >
            <p style={{ textAlign: "left", marginLeft: "2%" }}>
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
          <button className="prev-next" onClick={() => handleStep2()}>
            previous
          </button>
          <button
            className="prev-next"
            style={{
              backgroundColor: "white",
              border: "7px",
              borderColor: "blue"
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
              <h3>Please approve or reject this agreement</h3>
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

              <button onClick={approveAgreement}>Approve</button>
              <button onClick={rejectAgreement}>Reject</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Agreement;
