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
  // const { gameId } = props.match.params;

  let [i, setI] = useState(0);

  function handleEnter() {
    if (i < Scene.cutList.length -1) {
      setI(++i);
    }
    console.log(i);
  }

  useKey("Enter", handleEnter);

  // const [Scene, setScene] = useState({});
  // const startScene = () => {
  //   Axios.get(`/api/game/gamestart/${gameId}`)
  //   .then((response) => {
  //     if (response.data.scene) {
  //       return response.data.scene;
  //     } else {
  //       return null;
  //     }
  //   });
  // }

  const Scene = {
    cutList: [
      {
        characterCnt: 1,
        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "사랑해요... 통키씨....",
      },
      {
        characterCnt: 1,
        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "햝고싶어요...",
      },
      {
        characterCnt: 1,
        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "나",
        script: "(조금 무서워진다...)",
      },
      {
        characterCnt: 1,
        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "이런 저라도 사랑해주실 수 있나요?",
      },
      {
        characterCnt: 1,
        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "당신만은 절 버리지 마세요",
      },
      {
        characterCnt: 1,
        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "안그러면 죽일거에요",
      },
      {
        characterCnt: 1,
        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "(눈을 부릅 뜬다...)",
      },
    ],
    nextList: [1, 2, 3, 4],
  };

  // let scene = startScene()
  // setScene(0);
  // console.log("scene", Scene);

  // useEffect(() => {
  //   console.log(working?)
  //   Axios.get(`/api/game/getnextscene/${1}`).then((response) => {
  //     if (response.data.success) {
  //       i = 0;
  //       setScene(response.data);
  //     } else {
  //       alert("Scene 정보가 없습니다.");
  //     }
  //   });
  // }, [Scene]);
  console.log(Scene);
  if (Scene) {
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
