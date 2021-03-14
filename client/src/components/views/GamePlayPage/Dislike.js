import React from "react";
import "./Dislike.css";

function DislikePopup(props) {
  return props.trigger ? (
    <div className="dislike_popup">
      <div className="dislike_inner">
        <div className="dislike_btn">
            <button className="close_btn" onClick={() => props.setTrigger(false)}>
            close
            </button>
        </div>
        <div className="dislike_text">
            <h3>신고되었습니다...</h3>
        </div>
        
      </div>
    </div>
  ) : (
    ""
  );
}

export default DislikePopup;
