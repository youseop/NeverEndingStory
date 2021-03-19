import React from "react";
import "../SceneMakeModal.css";

const SceneMakeModalTab = ({ setTag, tag }) => {
  return (
    <div className="tabs">
      <div
        className={`${tag === 1 ? "tab is-selected" : "tab"}`}
        onClick={() => setTag(1)}>
        Character
          </div>
      <div
        className={`${tag === 2 ? "tab is-selected" : "tab"}`}
        onClick={() => setTag(2)}>
        Background
          </div>
      <div
        className={`${tag === 3 ? "tab is-selected" : "tab"}`}
        onClick={() => setTag(3)}>
        Bgm
          </div>
      <div
        className={`${tag === 4 ? "tab is-selected" : "tab"}`}
        onClick={() => setTag(4)}>
        Sound
          </div>
    </div>
  )
}
export default SceneMakeModalTab;
