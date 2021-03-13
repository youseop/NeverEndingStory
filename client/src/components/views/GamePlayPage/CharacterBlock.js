import './CharacterBlock.css';
import React from 'react'
const CharacterBlock = (props) => {
    const {characterCnt, characterList} = props;
  return (
      <img className="characterblock" src={characterList[0]}/>
  );
}

export default CharacterBlock
