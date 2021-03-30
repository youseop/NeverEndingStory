import React, { memo, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Character from "../../functions/CharacterModal/Character";

import "./CharacterBlock.css";
const CharacterBlock = (props) => {
  const { onRemove_character, GameCharacterList } = props;

  const CharacterList = useSelector(state => state.character.CharacterList)
  const characterblocks = CharacterList?.map((charSchema, index) => {
    return (
      <div key={index}>
        <Character
          GameCharacterList={GameCharacterList}
          onRemove_character={onRemove_character}
          index={index}
          charSchema={charSchema}
        />
      </div>
    );
  });

  return (
    CharacterList?.length > 0 &&
    <div className="CharacterBlocks" id="CharacterBlocks">
      {characterblocks}
    </div>
  )
};

export default memo(CharacterBlock);
