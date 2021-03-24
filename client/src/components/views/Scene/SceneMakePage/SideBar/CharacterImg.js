import React from 'react'
import { message } from 'antd';
import { useDispatch } from "react-redux";
import { selectCharacter } from '../../../../../_actions/characterSelected_actions';

function CharacterImg({ character, index }) {
  const dispatch = useDispatch();

  const onClick_selectCharacter = () => {
    dispatch(selectCharacter({ ...character, index: index }));
  }

  return (
    <div>
      <div onClick={onClick_selectCharacter}>
        <img src={`${character.image_array[0]}`} alt="img" />
      </div>
    </div>
  )
}

export default CharacterImg
