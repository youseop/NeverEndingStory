import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import "./TreeMap.css";
import { message } from "antd";

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

//* 나중에 스키마로 만들어야함
const SceneDepth = 4;
const sceneMap = [
  { sceneId: 1, link: null },
  { sceneId: 2, link: null },
  { sceneId: 3, link: null },
  { sceneId: 4, link: null },
  { sceneId: null, link: null },
  { sceneId: null, link: null },
  { sceneId: 7, link: null },
  { sceneId: 8, link: null },
  { sceneId: 9, link: null },
  { sceneId: 10, link: null },
  { sceneId: 11, link: null },
  { sceneId: 12, link: null },
  { sceneId: 13, link: null },
  { sceneId: 14, link: null },
  { sceneId: 15, link: null },
  { sceneId: 16, link: null },
  { sceneId: 17, link: null },
  { sceneId: 18, link: null },
  { sceneId: 19, link: null },
  { sceneId: 20, link: null },
  { sceneId: 21, link: null },
  { sceneId: 22, link: null },
];

const nodeWidth = 10;
const nodeHeight = 5;

let pivot = [0, 0];
let position = [50, 0];
let drag = false;

function TreeMapPopup(props) {
  const { trigger, userhistory, setTrigger, setClickable } = props;
  const { gameId, sceneId } = props.history;

  const [Position, setPosition] = useState();
  
  useConstructor(() => {
    setPosition(position);
    // console.log("constructor");
    // console.log(userhistory);
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
    if (drag) {
      if (pivot[0] !== e.pageX || pivot[1] !== e.pageY) {
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

  let depth = 1;
  let cnt_limit = 1;
  let cnt = 0;
  const TreeMap_nodes = sceneMap.map((scene, index) => {
    if (cnt === cnt_limit) {
      depth += 1;
      cnt = 0;
      cnt_limit = cnt_limit * 4;
    }
    cnt += 1;

    // console.log(index, depth);

    return (
      <div
        className="TreeMap_nodeContainer"
        style={{
          width: (1 / SceneDepth) * 100 + "%",
          height: (1 / cnt_limit) * 100 + "%",
          left: ((depth - 1) / SceneDepth) * 100 + "%",
          top: ((cnt - 1) / cnt_limit) * 100 + "%",
        }}
      >
        {/* {index} */}
        <div
          className="TreeMap_node"
          style={{ width: 1 +"rem", height: 1+"rem" }}

        />
        {depth !== SceneDepth ? (
          <Fragment>
            <hr
              className="TreeMap_nodeLine"
              style={{ left: "70%", top: "12.5%" }}
            />
            <hr
              className="TreeMap_nodeLine"
              style={{ left: "70%", top: "37.5%" }}
            />
            <hr
              className="TreeMap_nodeLine"
              style={{ left: "70%", top: "62.5%" }}
            />
            <hr
              className="TreeMap_nodeLine"
              style={{ left: "70%", top: "87.5%" }}
            />
            <hr
              className="TreeMap_nodeLine"
              style={{ left: "50%", top: "50%" }}
            />
            <hr className="TreeMap_nodeLine_vertical" />
          </Fragment>
        ) : null}
      </div>
    );
  });

  return trigger ? (
    <div className="TreeMap_popup">
      <button className="close_btn" onClick={() => close_button()}>
        close
      </button>
      <div
        className="TreeMap_inner"
        style={{
          width: nodeWidth * SceneDepth + "%",
          height: nodeHeight * Math.pow(4, SceneDepth - 1) + "%",
          left: Position[0],
          top: Position[1],
        }}
      >
        {TreeMap_nodes}
      </div>
    </div>
  ) : null;
}

export default TreeMapPopup;
