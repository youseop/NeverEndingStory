import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./HistoryMap.css";
import { message, Button, Modal } from "antd";
import { SVG } from "../../svg/icon";
import "../Scene/SceneMakePage/EndingModal.css"

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
  const { userhistory, gameId, sceneId, targetScene, setScene } = props;
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
  const { userhistory, setTrigger, setScene, isFullscreen } = props;
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
      Axios.get("/api/game/simple-scene-info").then((response) => {
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

  const full = isFullscreen ? "full" : "";

  const HistoryMap_scenes = SceneInfo.map((scene, index) => {
    if (index === SceneInfo.length - 1) {
      return (
        <div
          className="HistoryMap_scene"
          key={index + 1}
          style={{ border: "0.2em orange solid" }}
        >
          <div className={`HistoryMap_scene_num ${full}`}> #{index + 1}</div>
          <img className={`HistoryMap_scene_img ${full}`} src={scene.background} />
          <div className={`HistoryMap_scene_name ${full}`}>{scene.name}:</div>
          <div className={`HistoryMap_scene_text ${full}`}>"{scene.script}"</div>
        </div>
      );
    } else {
      return (
        <div
          className="HistoryMap_scene"
          key={index + 1}
          onClick={() => showModal(index + 1)}
        >
          <div className={`HistoryMap_scene_num ${full}`}> #{index + 1}</div>
          <img className={`HistoryMap_scene_img ${full}`} src={scene.background} />
          <div className={`HistoryMap_scene_name ${full}`}>{scene.name}:</div>
          <div className={`HistoryMap_scene_text ${full}`}>"{scene.script}"</div>
        </div>
      );
    }
  });

  return props.trigger ? (
    <div className="HistoryMap_popup">
      <div className="HistoryMap_explain">
        박스를 누르면 해당 이야기로 돌아갈 수 있습니다.
      </div>
      <div className="close_btn" onClick={() => close_button()}>
        <SVG
          className="close_btn"
          src="close_2"
          width="45"
          height="50"
          color="#F5F5F5"
        ></SVG>
      </div>

      <div className={`HistoryMap-toleft_btn ${full}`} onClick={MapToLeft}>
        <SVG
          src="arrow_1"
          width="100%"
          height="100%"
          color="#F5F5F5"
        />
      </div>

      <div className={`HistoryMap-toright_btn ${full}`} onClick={MapToRight}>
        <SVG
          src="arrow_1"
          width="100%"
          height="100%"
          color="#F5F5F5"
        />
      </div>

      <div
        className={`HistoryMap_inner ${full}`}
        style={{ width: sceneInfo.length * 15 + "%" }}
      >
        {HistoryMap_scenes}
      </div>
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer='.gamePlay__container'
        centered={true}
        maskClosable={false}
        closable={false}
        okText="확인"
        cancelText="취소"
      >
        <div style={{ "display":"flex"}}>
          <div className="ending_modal_warning_sign"><svg color="#faad14" viewBox="64 64 896 896" focusable="false" className="" data-icon="exclamation-circle" width="20px" height="20px" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path></svg></div>
          <div className="ending_modal_warning_textarea">
            <h2>주의!</h2>
            <br></br>
            <h3>{targetScene} 번째 씬으로 돌아갑니다.</h3>
            <h3>돌아가려는 씬까지의 기록은 삭제됩니다.</h3>
          </div>
        </div>
      </Modal>
    </div>
  ) : null;
}

export default HistoryMapPopup;
