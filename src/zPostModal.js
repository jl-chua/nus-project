import React, { useState, useEffect, useRef } from "react";
import { RiDeleteBin4Line } from "react-icons/ri";
import { useGobalContext } from "./context";
import { FaTimes } from "react-icons/fa";
import WritePost from "./WritePost";

function PostModal({ posts, currentUserName, currentUserProfilePic }) {
  const { openModal, isModalOpen, closeModal } = useGobalContext();
  const [lists, setLists] = useState();
  const [items, setItems] = useState();
  const inputRef = useRef(null);

  useEffect(() => {
    //console.log(posts)
    setItems(
      posts.map((item) => {
        return {
          itemId: item.id,
          itemName: item.name,
          itemMessage: item.message,
          itemImageURL: item.imageURL,
          itemTimestamp: item.timestamp
        };
      })
    );
  }, [posts]);

  const onClick = () => {
    openModal();
    //setLists(items);
  };

  const handleDelete = (id) => {
    const newLists = lists.filter((list) => list.itemId !== id);
    setLists(newLists);
  };

  const submitAgreement = (e) => {
    e.preventDefault();
    WritePost(
      "agreement",
      "draft",
      inputRef.current.value,
      currentUserName,
      currentUserProfilePic,
      null
    );
  };

  // const createAgreement = () => {
  //     //console.log(lists)

  //     console.log(lists)

  // }

  return (
    <div>
      <button onClick={onClick}>agreement</button> <br />
      <br />
      <br />
      {/* {e.default}  */}
      {/* {onChange= ((e)= > setSomething{e.target.value})} */}
      <form onSubmit={submitAgreement}>
        <label for="msg">
          <span>Summarise this agreement</span>
        </label>{" "}
        <br />
        <textarea
          name="message"
          rows="6"
          required
          autocomplete="off"
          ref={inputRef}
        ></textarea>{" "}
        <br /> <br />
        <input type="submit" value="submit" />
      </form>
      <div
        className={`${
          isModalOpen ? "modal-overlay show-modal" : "modal-overlay"
        }`}
      >
        <div className="modal-container">
          <button onClick={closeModal} className="close-modal-btn">
            {" "}
            <FaTimes />{" "}
          </button>

          <div style={{ marginTop: "5rem" }}>
            {lists &&
              lists.map((list) => {
                const { itemId, itemMessage, itemName, itemImageURL } = list;

                return (
                  <div key={itemId}>
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
                          margin: "5%",
                          backgroundColor: "white",
                          padding: "4px",
                          borderRadius: "4px"
                        }}
                      >
                        {itemName}
                      </p>

                      <p style={{ textAlign: "left", margin: "5% 5% 5% 2%" }}>
                        {itemMessage}{" "}
                      </p>

                      {itemImageURL !== undefined && (
                        <img
                          src={itemImageURL}
                          alt="posted"
                          height="50"
                          style={{
                            alignItems: "center",
                            margin: "2.2% 0% 0% 0%"
                          }}
                        />
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "auto",
                          marginRight: "10%"
                        }}
                      >
                        <RiDeleteBin4Line
                          onClick={() => handleDelete(itemId)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <br />
          {/* <button onClick={createAgreement}>create agreement</button> */}
          <br />
          <br />
        </div>
      </div>
      <br />
      {/* <button onClick={createAgreement}>create agreement</button> */}
    </div>
  );
}

export default PostModal;
