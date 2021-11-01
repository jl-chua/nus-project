import React, { useState } from "react";
import Cea from "./Cea";

function UseTemplates() {
  const [show, setShow] = useState(true);

  const cea = () => {
    setShow(false);
  };

  return (
    <div>
      {show && (
        <div style={{ margin: "10%", display: "block" }}>
          <button onClick={cea}>Lease Agreement by CEA</button>
          <button>Lease Agreement by ERA</button>
          <button>Lease Agreement by ProNex</button>
        </div>
      )}

      {!show && <Cea />}
    </div>
  );
}

export default UseTemplates;
