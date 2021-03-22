import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./TreeMap.css";
import { message } from "antd";

function MapMove(x, y) {
  var map = document.getElementsByClassName("TreeMap_example")[0];
  var computedStyle = window.getComputedStyle(map);
  var left = computedStyle.getPropertyValue("left");
  var top = computedStyle.getPropertyValue("top");
  console.log("computed:" + left + top);
  // var new_position =
  // transform !== "none" ? parseInt(transform.split(",")[4]) : 0;
  // map.style.transform = `translate(${new_position - 250}px, 0px)`;
  map.style.left = `(${parseInt(left) + x}px)`;
  map.style.top = `(${parseInt(top) + y}px)`;
  console.log("new:" + `(${parseInt(left) + x}px)`, `(${parseInt(top) + y}px)`);
}

function GoToScene(props) {
  const { userhistory, gameId, sceneId, GoScene } = props;
  const data = { data: { sceneIndex: GoScene - 1 } };
  Axios.post("/api/game/refreshHistory", data).then((response) => {
    if (!response.data.success) {
      message.error("Scene 변경 요청 실패");
    } else {
      userhistory.push(`/gameplay/${gameId}/${sceneId[GoScene - 1]}`);
      const close = document.getElementsByClassName("close_btn");
      for (let i = close.length - 1; i >= 0; i--) {
        close[i].click();
      }
    }
  });
}

function GetSceneInfo(props) {
  const { index, scene, setSceneInfo } = props;
  Axios.get(`/api/game/getSceneInfo/${scene}`).then((response) => {
    if (!response.data.success) {
      alert("Scene 정보 없음...");
    } else {
      const cutList = response.data.scene.cutList;
      const lastcut = cutList[cutList.length - 1];
      setSceneInfo({
        sceneindex: index,
        background: lastcut.background,
        name: lastcut.name,
        script: lastcut.script,
      });
    }
  });
}

function useConstructor(callBack = () => {}) {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
}

let pivot = [0, 0];
let position = [50, 0];
let drag = false;

function TreeMapPopup(props) {
  const { trigger, userhistory, setTrigger, setClickable } = props;
  const { gameId, sceneId } = props.history;

  const [Position, setPosition] = useState();

  useConstructor(() => {
    setPosition(position);
    console.log("constructor");
  });

  useEffect(() => {
    var container = document.getElementsByClassName("TreeMap_popup");
    if (trigger) {
      setClickable(true);
      container[0].addEventListener("mousedown", mouseDown);
      container[0].addEventListener("mouseup", mouseUp);
      container[0].addEventListener("mousemove", mouseMove);
    } else {
      if (container[0]) {
        container[0].removeEventListener("mousedown", mouseDown);
        container[0].removeEventListener("mouseup", mouseUp);
        container[0].removeEventListener("mousemove", mouseMove);
      }
    }
  }, [trigger]);

  function close_button() {
    setClickable(false);
    setTrigger(false);
  }

  function mouseDown(e) {
    pivot = [e.pageX, e.pageY];
    drag = true;
    e.preventDefault();
  }

  function mouseUp(e) {
    drag = false;
    e.preventDefault();
  }

  function mouseMove(e) {
    // console.log(Origin);
    if (drag) {
      if (pivot[0] != e.pageX || pivot[1] != e.pageY) {
        position = [
          position[0] - (pivot[0] - e.pageX),
          position[1] - (pivot[1] - e.pageY),
        ];
        setPosition(position);
        pivot = [e.pageX, e.pageY];
      }
    }
    e.preventDefault();
  }

  return trigger ? (
    <div className="TreeMap_popup">
      <button className="close_btn" onClick={() => close_button()}>
        close
      </button>
      <div
        className="TreeMap_example"
        style={{ left: Position[0], top: Position[1] }}
      >
        예시
      </div>
    </div>
  ) : null;
}

export default TreeMapPopup;
