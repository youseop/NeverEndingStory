import React, { useState } from "react";
import Axios from "axios";
import "./HistoryMap.css";
import { message } from "antd";

function MapToLeft() {
  var map = document.getElementsByClassName("HistoryMap_inner")[0];
  var computedStyle = window.getComputedStyle(map);
  var transform = computedStyle.getPropertyValue("transform");
  var new_position =
    transform !== "none" ? parseInt(transform.split(",")[4]) : 0;

  map.style.transform = `translate(${new_position + 250}px, 0px)`;
}

function MapToRight() {
  var map = document.getElementsByClassName("HistoryMap_inner")[0];
  var computedStyle = window.getComputedStyle(map);
  var transform = computedStyle.getPropertyValue("transform");
  var new_position =
    transform !== "none" ? parseInt(transform.split(",")[4]) : 0;

  map.style.transform = `translate(${new_position - 250}px, 0px)`;
}

function GoToScene(props) {
  const { userhistory, gameId, sceneId, GoScene,setScene } = props;
  const data = { data: { sceneIndex: GoScene - 1 } };
  Axios.post("/api/game/refreshHistory", data).then((response) => {
    if (!response.data.success) {
      message.error("Scene 변경 요청 실패");
    } else {
      const close = document.getElementsByClassName("close_btn");
      for (let i = close.length - 1; i >= 0; i--) {
        close[i].click();
      }
      // console.log(setScene)
      setScene({});
      userhistory.replace({
        pathname: `/gameplay`,
        state: {
          sceneId: sceneId[GoScene - 1],
          gameId: gameId,
        }
      })
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
        background: lastcut?.background,
        name: lastcut?.name,
        script: lastcut?.script,
      });
    }
  });
}

function HistoryMapPopup(props) {
  const { userhistory, setTrigger, setScene } = props;
  const { gameId, sceneId } = props.history;
  const [GoScene, setGoScene] = useState(null);
  const [DelayHandler, setDelayHandler] = useState(null);
  const [SceneInfo, setSceneInfo] = useState(null);

  function delay(index, scene, setSceneInfo) {
    setDelayHandler(
      setTimeout(() => {
        GetSceneInfo({ index, scene, setSceneInfo });
      }, 300)
    );
  }

  function delay_reset() {
    setSceneInfo(null);
    clearTimeout(DelayHandler);
  }

  function close_button() {
    setTrigger(false);
  }

  const HistoryMap_scenes = sceneId.map((scene, index) => {
    return (
      <div
        className="HistoryMap_scene"
        key={index + 1}
        onMouseEnter={() => delay(index, scene, setSceneInfo)}
        onMouseLeave={() => delay_reset()}
        onClick={() => setGoScene(index + 1)}
      >
        {SceneInfo && SceneInfo.sceneindex === index ? (
          <div>
            <div className="HistoryMap_scene_num"> #{index + 1}</div>
            <img className="HistoryMap_scene_img" src={SceneInfo.background} />
            <div className="HistoryMap_scene_name">{SceneInfo.name}:</div>
            <div className="HistoryMap_scene_text">"{SceneInfo.script}"</div>
          </div>
        ) : (
          <div>
            <div className="HistoryMap_scene_num"> #{index + 1}</div>
          </div>
        )}
      </div>
    );
  });

  //! 해당 녀석 클릭과 화면 클릭을 같게 인식한다.. 이부분을 고쳐야합니다!!
  return props.trigger ? (
    <div className="HistoryMap_popup">
      <button className="close_btn" onClick={() => close_button()}>
        close
      </button>

      <div className="toleft_btn" onClick={MapToLeft}>
        to left 나중에 이미지로 대체
      </div>

      <div className="toright_btn" onClick={MapToRight}>
        to right 나중에 이미지로 대체
      </div>

      <div className="HistoryMap_inner">{HistoryMap_scenes}</div>

      {GoScene ? (
        <div className="warning_popup">
          <button
            className="ok_btn"
            onClick={() => GoToScene({ userhistory, gameId, sceneId, GoScene,setScene })}
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
      ) : null}
    </div>
  ) : null;
}

export default HistoryMapPopup;
