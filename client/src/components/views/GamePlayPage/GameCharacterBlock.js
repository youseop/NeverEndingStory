import "./GameCharacterBlock.css";
import React from "react";
const GameCharacterBlock = (props) => {
  const { characterList, onRemove_character } = props;
  const positionX = [[35], [20, 50], [10, 35, 60]];
  const positionY = [[10], [10, 20], [0, 15, 90]];
  const characterblocks = characterList.map((url, index) => {
    console.log(url)
    return (
      <img
        className="characterblock"
        style={{ left: `${positionX[characterList.length - 1][index]}%`,
                 bottom: `${positionY[characterList.length - 1][index]}%` }}
        src={url}
        key={index}
        onClick={() => onRemove_character(index)}
        alt="Network Error"
      />
    );
  });

  return <div>{characterblocks}</div>;
};

export default GameCharacterBlock;