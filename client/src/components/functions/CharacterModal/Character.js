import React, { useRef, memo, useState } from 'react';
import CharacterModal from './CharacterModal';
import './Character.css';
import { useDispatch } from 'react-redux';
import { selectCharacter } from '../../../_actions/characterSelected_actions';
import CharacterSize from './CharacterSize/CharacterSize';
import CharacterMoveX from './CharacterMove/CharacterMoveX';
import CharacterMoveY from './CharacterMove/CharacterMoveY';

function Character(props) {
  const dispatch = useDispatch();
  const { charSchema, GameCharacterList, setCharacterList , index, onRemove_character } = props;

  const [clicked, setClicked] = useState(false);

  const onClick_selectCharacter = () => {
    dispatch(selectCharacter({...GameCharacterList[charSchema.index], index: charSchema.index}));
  }

  const element = useRef();

  return (
    <div 
      ref={element}
      className="character__container"
      style={{height: `${charSchema.size}%`,
              top: `${charSchema.posY}%`}}>
        <CharacterMoveX 
          posX={charSchema.posX}
          setCharacterList={setCharacterList} 
          index={index}
          element={element}
        />
        <CharacterMoveY 
          setCharacterList={setCharacterList} 
          index={index}
          element={element}
        />
        {/* <CharacterSize 
          setCharacterList={setCharacterList} 
          index={index}
          element={element}
        /> */}
        <img
          onClick={onClick_selectCharacter}
          className="character__img"
          id={`${index}`}
          src={charSchema.image}
          alt="img"
        />
    </div>
  )
}

export default memo(Character)
