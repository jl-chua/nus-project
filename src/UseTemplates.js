import React, { useState } from "react";
import Cea from "./Cea";
import "./UseTemplates.css";

function UseTemplates() {
  const [show, setShow] = useState(true);

  const cea = () => {
    setShow(false);
  };

  return (
    <div>
      {show && (
        <div style={{ margin: "10%", display: "block" }}>
          <button
            style={{
              backgroundColor: "#1c1c1e",
              borderRadius: "50px",
              fontSize: "13px",
              height: "30px",
              width: "345px",
              cursor: "pointer",
              paddingRight: "160px"
            }}
            onClick={cea}
          >
            A. Lease Agreement by CEA
          </button>
          <br />
          <br />
          <button
            style={{
              backgroundColor: "#1c1c1e",
              borderRadius: "50px",
              fontSize: "13px",
              height: "30px",
              width: "345px",
              cursor: "pointer",
              paddingRight: "160px"
            }}
            onClick={cea}
          >
            B. Lease Agreement by ERA
          </button>
          <br />
          <br />
          <button
            style={{
              backgroundColor: "#1c1c1e",
              borderRadius: "50px",
              fontSize: "13px",
              height: "30px",
              width: "345px",
              cursor: "pointer",
              paddingRight: "130px"
            }}
            onClick={cea}
          >
            C. Lease Agreement by PropNex
          </button>
        </div>
      )}

      {!show && <Cea />}
    </div>
  );
}

export default UseTemplates;
