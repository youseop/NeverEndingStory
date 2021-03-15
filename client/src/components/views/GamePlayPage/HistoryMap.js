import { getInputClassName } from "antd/lib/input/Input";
import React, { useState } from "react";
import "./HistoryMap.css";

function click() {
  var map = document.getElementsByClassName("HistoryMap_inner")[0];
  var computedStyle = window.getComputedStyle(map);
  var transform = computedStyle.getPropertyValue("transform");
  var new_position =
    transform != "none" ? parseInt(transform.split(",")[4]) : 0;

  map.style.transform = `translate(${new_position - 150}px, 0px)`;
}

function GoToScene(props){
  console.log(props)

  // {`/gameplay/${props.gameId}/${GoScene}`}
}

function HistoryMapPopup(props) {
  const { gameId, sceneId } = props.history;
  const [GoScene, setGoScene] = useState(null);

  // console.log(sceneId);

  const HistoryMap_scenes = sceneId.map((scene) => {
    return (
      <li
        className="HistoryMap_scene"
        key={scene}
        onClick={() => setGoScene(scene)}
      >
        {scene}
      </li>
    );
  });

  return props.trigger ? (
    <div className="HistoryMap_popup" onClick={click}>
      <button className="close_btn" onClick={() => props.setTrigger(false)}>
        close
      </button>
      <div className="HistoryMap_inner">
        <ul className="slide_wrap">{HistoryMap_scenes}</ul>
      </div>
      {GoScene ?
      <div className="warning_popup">
        <button className="go_btn" onClick={() => GoToScene({gameId,GoScene})}>
          ok
        </button>
        <button className="close_btn" onClick={() => setGoScene(false)}>
          close
        </button>
        <div>are you sure? 다시는 돌아올 수 없다?</div>
      </div>
      : ""}
    </div>
  ) : (
    ""
  );
}

export default HistoryMapPopup;
