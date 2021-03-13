import './CharacterBlock.css';
import React from 'react'
const CharacterBlock = (props) => {
    const {url} = props;
  return (
      <img className="characterblock" src={url}/>
  );
}

export default CharacterBlock
