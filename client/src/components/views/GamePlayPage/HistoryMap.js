import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./HistoryMap.css";
import { message, Button, Modal } from "antd";
import { SVG } from "../../svg/icon";

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
  const { userhistory, gameId, sceneId, targetScene,setScene } = props;
  const data = { data: { sceneIndex: targetScene - 1 } };
  Axios.post("/api/game/refreshHistory", data).then((response) => {
    if (!response.data.success) {
      message.error("Scene 변경 요청 실패");
    } else {
      const close = document.getElementsByClassName("close_btn");
      for (let i = close.length - 1; i >= 0; i--) {
        close[i].click();
      }
      setScene({});

      userhistory.replace({
        pathname: `/gameplay`,
        state: {
          sceneId: sceneId[targetScene - 1],
          gameId: gameId,
        },
      });
    }
  });
}

let sceneInfo = [];
let targetScene = 1;

function HistoryMapPopup(props) {
  const { userhistory, setTrigger, setScene } = props;
  const { gameId, sceneId } = props.history;
  const [SceneInfo, setSceneInfo] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (target) => {
    targetScene = target;
    setIsModalVisible(true);
  };

  const handleOk = () => {
    GoToScene({ userhistory, gameId, sceneId, targetScene, setScene });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (props.trigger) {
      Axios.get("api/game/simple-scene-info").then((response) => {
        sceneInfo = response.data.sceneinfo;
        setSceneInfo(sceneInfo);
      });
      return () => {
        setSceneInfo([]);
      };
    }
  }, [props.trigger]);

  function close_button() {
    setTrigger(false);
  }

  const HistoryMap_scenes = SceneInfo.map((scene, index) => {
    if (index === SceneInfo.length - 1) {
      return (
        <div
          className="HistoryMap_scene"
          key={index + 1}
          style={{border:"0.2em orange solid"}}
        >
          <div className="HistoryMap_scene_num"> #{index + 1}</div>
          <img className="HistoryMap_scene_img" src={scene.background} />
          <div className="HistoryMap_scene_name">{scene.name}:</div>
          <div className="HistoryMap_scene_text">"{scene.script}"</div>
        </div>
      );
    } else {
      return (
        <div
          className="HistoryMap_scene"
          key={index + 1}
          onClick={() => showModal(index + 1)}
        >
          <div className="HistoryMap_scene_num"> #{index + 1}</div>
          <img className="HistoryMap_scene_img" src={scene.background} />
          <div className="HistoryMap_scene_name">{scene.name}:</div>
          <div className="HistoryMap_scene_text">"{scene.script}"</div>
        </div>
      );
    }
  });

  return props.trigger ? (
    <div className="HistoryMap_popup">
      <div className="close_btn" onClick={() => close_button()}>
        <SVG
          className="close_btn"
          src="close_2"
          width="45"
          height="50"
          color="#F5F5F5"
        ></SVG>
      </div>

      <div className="HistoryMap-toleft_btn" onClick={MapToLeft}>
        <SVG
          src="arrow_1"
          width="100%"
          height="100%"
          color="#F5F5F5"
        />
      </div>

      <div className="HistoryMap-toright_btn" onClick={MapToRight}>
        <SVG
          src="arrow_1"
          width="100%"
          height="100%"
          color="#F5F5F5"
        />
      </div>

      <div
        className="HistoryMap_inner"
        style={{ width: sceneInfo.length * 15 + "%" }}
      >
        {HistoryMap_scenes}
      </div>

      <Modal
        title="경고"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer='.gamePlay__container'
        centered={true}
      >
        <p>
          {targetScene} 번째 씬으로 돌아갑니다. 돌아가려는 씬까지의 기록은
          삭제됩니다.
        </p>
      </Modal>
    </div>
  ) : null;
}

export default HistoryMapPopup;
