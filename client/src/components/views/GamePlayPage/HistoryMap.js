import React, { useState } from "react";
import Axios from "axios";
import "./HistoryMap.css";

function click() {
  var map = document.getElementsByClassName("HistoryMap_inner")[0];
  var computedStyle = window.getComputedStyle(map);
  var transform = computedStyle.getPropertyValue("transform");
  var new_position =
    transform != "none" ? parseInt(transform.split(",")[4]) : 0;

  map.style.transform = `translate(${new_position - 150}px, 0px)`;
}

function GoToScene(props) {
  const { gameId, sceneId, GoScene } = props;
  const data = { data: { sceneIndex: GoScene } };
  Axios.post("/api/game/refreshHistory", data).then((response) => {
    if (response.data.success) {
      window.location.replace(`/gameplay/${gameId}/${sceneId[GoScene]}`);
    } else {
      alert("Scene 변경 요청 실패");
    }
  });
}

function GetSceneInfo(props) {
  console.log("props");

  const { scene } = props;
  Axios.get(`/api/game/getSceneInfo/${scene}`).then((response) => {
    console.log(response);
    if (response.data.sucess) {
      // setSceneInfo(scene[index])
    } else {
      alert("Scene 정보 없음...");
    }
  });
}

function HistoryMapPopup(props) {
  const { gameId, sceneId } = props.history;
  const [GoScene, setGoScene] = useState(null);
  const [SceneInfo, setSceneInfo] = useState(null);

  const HistoryMap_scenes = sceneId.map((scene, index) => {
    return (
      <li
        className="HistoryMap_scene"
        key={index + 1}
        onMouseOver={() =>GetSceneInfo({scene,setSceneInfo})}
        onClick={() => setGoScene(index + 1)}
      >
        {index + 1}
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
      {GoScene ? (
        <div className="warning_popup">
          <button
            className="ok_btn"
            onClick={() => GoToScene({ gameId, sceneId, GoScene })}
          >
            ok
          </button>
          <button className="close_btn" onClick={() => setGoScene(null)}>
            close
          </button>
          <div className="warning_text">
            are you sure? 다시는 돌아올 수 없다?
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    ""
  );
}

export default HistoryMapPopup;
