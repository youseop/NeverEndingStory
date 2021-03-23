import React, { memo, useEffect } from 'react'
import Character from "../../functions/CharacterModal/Character";

import "./CharacterBlock.css";

const CharacterBlock = (props) => {
  const { onRemove_character, CharacterList, GameCharacterList, setCharacterList } = props;

  const characterblocks = CharacterList.map((charSchema, index) => {
    return (
      <div 
        key={index} 
        className="CharacterBlock"
        style={{ left: `${charSchema.posX}%`}}
      >
        <Character
          setCharacterList={setCharacterList}
          GameCharacterList={GameCharacterList}
          onRemove_character={onRemove_character}
          index={index}
          charSchema={charSchema}
        />
      </div>
    );
  });

  return (
      <div className="CharacterBlocks" id="CharacterBlocks">
        {characterblocks}
      </div>
  )
};

export default memo(CharacterBlock);
