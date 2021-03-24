import "./GameCharacterBlock.css";
import React from "react";
const GameCharacterBlock = (props) => {
  const { characterList, onRemove_character } = props;
  
  const characterblocks = characterList.map((characterSchema, index) => {
    return (
      <div>
      <img
        className="characterblock"
        style={{ left: `${characterSchema.posX}%`,
                 bottom: `${characterSchema.posY}%` }}
        src={characterSchema.image}
        key={index}
        onClick={() => onRemove_character(index)}
        alt="Network Error"
      />
    </div>
    )
  });

  return <div className="CharacterBlocks" >{characterblocks}</div>;
};

export default GameCharacterBlock;