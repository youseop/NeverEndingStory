import React from "react";
import "./HistoryMap.css";

function HistoryMapPopup(props) {
  return props.trigger ? (
    <div className="HistoryMap_popup">
      <button className="close_btn" onClick={() => props.setTrigger(false)}>
        close
      </button>
      <div className="HistoryMap_inner">
        <div>
          <h3>맵....</h3>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default HistoryMapPopup;
