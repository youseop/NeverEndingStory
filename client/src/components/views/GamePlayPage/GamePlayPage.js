import "./GamePlayPage.css";
import CharacterBlock from "./CharacterBlock";
import { TextBlock, TextBlockChoice } from "./TextBlock.js";
import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";

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
  const { sceneId } = props.match.params;

  const [i, setI] = useState(0);
  const [Scene, setScene] = useState({});

  function handleEnter() {
    if (i < Scene.cutList.length -1) {
      setI(i+1);
    }
    console.log(i);
  }

  useKey("Enter", handleEnter);

  useEffect(() => {
    Axios.get(`/api/game/getnextscene/${sceneId}`).then((response) => {
      if (response.data.success) {
        setI(0);
        setScene(response.data.scene);
      } else {
        alert("Scene 정보가 없습니다.");
      }
    });
  }, []);

  if (Scene.cutList) {
    return (
      <div className="productscreen">
        <div className="background_img_container">
          <img
            className="background_img"
            src={Scene.cutList[i].background}
            alt="Network Error"
          />
          <CharacterBlock
            characterCnt={Scene.cutList[i].characterCnt}
            characterList={Scene.cutList[i].characterList}
          />
          {i === Scene.cutList.length -1 ? (
            <TextBlockChoice
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
        </div>
      </div>
    );
  } else {
    return <div>now loading..</div>;
  }
};

export default ProductScreen;
