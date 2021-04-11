import React from "react";

const GameInfoModalTab = ({ setTag, tag }) => {
    return (
        <div className="tabs info">
            <div
                className={`${tag === 1 ? "tab is-selected" : "tab"}`}
                onClick={() => setTag(1)}>
                게임정보
          </div>
            <div
                className={`${tag === 2 ? "tab is-selected" : "tab"}`}
                onClick={() => setTag(2)}>
                출연진
          </div>
        </div>
    )
}
export default GameInfoModalTab;
