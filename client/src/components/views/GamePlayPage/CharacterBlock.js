import React, { memo, useEffect } from 'react'
import Character from "../../functions/CharacterModal/Character";

import "./CharacterBlock.css";

const CharacterBlock = (props) => {
  const { onRemove_character, CharacterList, GameCharacterList, setCharacterList } = props;

  const characterblocks = CharacterList.map((charSchema, index) => {
    return (
      <div key={index}>
        <Character
          setCharacterList={setCharacterList}
          GameCharacterList={GameCharacterList}
          onRemove_character={onRemove_character}
          CharacterList={CharacterList}
          index={index}
          charSchema={charSchema}
        />
      </div>
    );
  });

  return (
    CharacterList.length > 0 &&
    <div className="CharacterBlocks" id="CharacterBlocks">
      {characterblocks}
    </div>
  )
};

export default memo(CharacterBlock);
