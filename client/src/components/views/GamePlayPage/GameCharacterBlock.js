import "./GameCharacterBlock.css";
import React from "react";
const GameCharacterBlock = (props) => {
  const { characterList } = props;

  const characterblocks = characterList?.map((charSchema, index) => {
    return (
      <div key={index}>
        <div
          className="CharacterBlock"
          style={{ left: `${charSchema.posX}%` }}
        >
          <div
            className="character__container"
            style={{
              height: `${charSchema.size}%`,
              top: `${charSchema.posY}%`
            }}
          >
            <img
              className="characterImg"
              src={charSchema.image}
              alt="img"
            />
          </div>
        </div>
      </div>
    )
  });

  return <div className="CharacterBlocks" >{characterblocks}</div>;
};

export default GameCharacterBlock;