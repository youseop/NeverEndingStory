import React, { useState } from 'react'
import { message } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { pushCharacter, selectCharacter, popCharacter } from '../../../../../_actions/characterSelected_actions';
import { useConstructor } from '../../../../functions/useConstructor';

function CharacterImg({ character, index }) {
  const dispatch = useDispatch();
  const CharacterList = useSelector(state => state.character.CharacterList);
  const characterSelected = useSelector(state => state.character.characterSelected)
  const isIn = CharacterList?.some(item=>item.index===index);
  const selected= isIn?"selected":"";
  const onClick_selectCharacter = () => {
    const characterSchema = {
      index,
      image: character.image_array[0],
      posX: 30,
      posY: 15,
      reverse: 0,
      size: 90,
    }

    const dataToSubmit = { 
      oldArray: CharacterList,
      characterSchema
    }

    dispatch(selectCharacter({ ...character, index }));
    if ( isIn && (characterSelected?.index === index) ){
      dispatch(popCharacter({oldArray: CharacterList, index}))
    }
    else{
      dispatch(pushCharacter(dataToSubmit))
    }
  }

  return (
    <div className={`characterSidebar_box ${selected}`} key={`${index}`}>
    <div
      className="characterSidebar_image_box"
      onClick={onClick_selectCharacter}>
      <img
        src={character.image_array[0]}
        alt="img"
        className="characterSidebar_image"
      />
    </div>
    </div>
  )
}

export default CharacterImg
