import React from "react";
import "../SceneMakeModal.css";

const SceneMakeModalTab = ({ setTag, tag }) => {
  return (
    // <div className="sceenmake_modal_container2">
    <div className="tabs">
      <div
        className={`${tag === 1 ? "tab is-selected" : "tab"}`}
        onClick={() => setTag(1)}>
        캐릭터
          </div>
      <div
        className={`${tag === 2 ? "tab is-selected" : "tab"}`}
        onClick={() => setTag(2)}>
        배경
          </div>
      <div
        className={`${tag === 3 ? "tab is-selected" : "tab"}`}
        onClick={() => setTag(3)}>
        배경음악
          </div>
      <div
        className={`${tag === 4 ? "tab is-selected" : "tab"}`}
        onClick={() => setTag(4)}>
        효과음
          </div>
    </div>
    // </div>
  )
}
export default SceneMakeModalTab;
