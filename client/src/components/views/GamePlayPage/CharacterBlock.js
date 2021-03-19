import "./CharacterBlock.css";
import React from "react";
const CharacterBlock = (props) => {
  const { characterList, onRemove_character } = props;
  const position = [[35], [20, 50], [10, 60, 35]];
  const characterblocks = characterList.map((url, index) => {
    return (
      <img
        className="characterblock"
        style={{ left: `${position[characterList.length - 1][index]}%` }}
        src={url}
        key={index}
        onClick={() => onRemove_character(index)}
        alt="Network Error"
      />
    );
  });

  return <div>{characterblocks}</div>;
};

export default CharacterBlock;
