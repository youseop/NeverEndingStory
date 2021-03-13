import "./GamePlayPage.css";
import CharacterBlock from "./CharacterBlock";
import { TextBlock, TextBlockChoice } from "./TextBlock.js";
import React, { useEffect, useRef, useState } from "react";

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

const ProductScreen = () => {
  // axios
  let [i, setI] = useState(0);

  function handleEnter() {
    if (i < scene.length - 1) {
      setI(++i);
    }
    console.log(i);
  }

  useKey("Enter", handleEnter);

  const scene = [
    {
      background_img: "/back1.png",
      character_img: "/iu.png",
      text: "사랑해요... 통키씨....",
    },
    {
      background_img: "/back1.png",
      character_img: "/iu2.png",
      text: "정말로....",
    },
  ];

  const scene_hole = 3;

  const scene_next_list = [
    { id: 1, text: "나도 널...." },
    { id: 2, text: "사실 난...." },
    { id: 3, text: "난 통키가 아니야..." },
    { id: 4, text: null },
  ];

  return (
    <div className="productscreen">
      <div className="background_img_container">
        <img
          className="background_img"
          src={scene[i].background_img}
          alt="good"
        />
        <CharacterBlock url={scene[i].character_img} />
        {i === scene.length - 1 ? (
          <TextBlockChoice
            line_text={scene[i].text}
            scene_next_list={scene_next_list}
          />
        ) : (
          <TextBlock line_text={scene[i].text} />
        )}
      </div>
    </div>
  );
};

export default ProductScreen;
