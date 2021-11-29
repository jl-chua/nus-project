import React, { useState } from "react";
import ceaData from "./templateData";

function Cea() {
  const [data] = useState(ceaData);
  const [status, setStatus] = useState(false);
  const [statusMsg, setSatusMsg] = useState("pending");

  return (
    <div>
      {data.map((d) => {
        const { id, section, sectionTitle } = d;
        return (
          <div key={id}>
            <div style={{ display: "flex", margin: "5%" }}>
              <p style={{ margin: "2%", alignItem: "left", textAlign: "left" }}>
                {section}
              </p>
              <p style={{ margin: "2%", alignItem: "left" }}>{sectionTitle}</p>
              <p style={{ margin: "2%", alignItem: "right" }}>{statusMsg}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Cea;
