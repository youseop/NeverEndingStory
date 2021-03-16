import "./GamePlayPage.css";
import CharacterBlock from "./CharacterBlock";
import { TextBlock, TextBlockChoice } from "./TextBlock.js";
import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import DislikePopup from "./Dislike";
import HistoryMapPopup from "./HistoryMap";

// Use keyboard input
function useKey(key, cb) {
  const callbackRef = useRef(cb);

  useEffect(() => {
    callbackRef.current = cb;
  });

  useEffect(() => {
    function handle(event) {
      if (event.code === key) {
        callbackRef.current(event);
      }
    }
    document.addEventListener("keypress", handle);
    return () => document.removeEventListener("keypress", handle);
  }, [key]);
}

// playscreen
const ProductScreen = (props) => {
  const { gameId } = props.match.params;
  const { sceneId } = props.match.params;

  //! history 데이터 가정
  let history = {};
  const gameHistory = [
    {
      gameId: 1,
      // sceneId: [201, 202, 203],

      sceneId: [101, 102, 103,104, 105, 106,107, 108, 109,110, 111, 112],
    },
    {
      gameId: 2,
      sceneId: [201, 202, 203],
    },
    {
      gameId: 3,
      sceneId: [301, 302, 303],
    },
  ];

  if (props.user) {
    // console.log(props.user.userData.gameHistory)
    // const { gameHistory } = (props.user.userData.gameHistory)

    for (let i = 0; i < gameHistory.length; i++) {
      if (gameId == gameHistory[i].gameId) {
        history = gameHistory[i];
      }
    }
  }

  history = gameHistory[0];

  const [i, setI] = useState(0);  // 현재 CutNumber
  const [Scene, setScene] = useState({});
  const [Dislike, setDislike] = useState(false);
  const [HistoryMap, setHistoryMap] = useState(false);

  function handleEnter() {
    if (i < Scene.cutList.length - 1) {
      setI(i + 1);
    }
  }

  useKey("Enter", handleEnter);

  useEffect(() => {
    Axios.get(`/api/game/getnextscene/${gameId}/${sceneId}`).then(
      (response) => {
        if (response.data.success) {
          setI(0);
          setScene(response.data.scene);
        } else {
          alert("Scene 정보가 없습니다.");
        }
      }
    );
  }, [sceneId]);

  if (Scene.cutList) {
    return (
      <div>
        <div className="productscreen">
          <div className="background_img_container">
            <button
              className="HistoryMap_btn"
              onClick={() => setHistoryMap(true)}
            >
              미니맵
            </button>
            <img
              className="background_img"
              src={Scene.cutList[i].background}
              alt="Network Error"
            />
            <CharacterBlock
              characterCnt={Scene.cutList[i].characterCnt}
              characterList={Scene.cutList[i].characterList}
            />

            {i === Scene.cutList.length - 1 ? (
              <TextBlockChoice
                gameId={gameId}
                cut_name={Scene.cutList[i].name}
                cut_script={Scene.cutList[i].script}
                scene_next_list={Scene.nextList}
              />
            ) : (
              <TextBlock
                cut_name={Scene.cutList[i].name}
                cut_script={Scene.cutList[i].script}
              />
            )}
            <HistoryMapPopup
              history={history}
              trigger={HistoryMap}
              setTrigger={setHistoryMap}
            />
          </div>
        </div>
        <button onClick={() => setDislike(true)}>신고</button>

        <DislikePopup trigger={Dislike} setTrigger={setDislike} />
      </div>
    );
  } else {
    return <div>now loading..</div>;
  }
};

export default ProductScreen;
