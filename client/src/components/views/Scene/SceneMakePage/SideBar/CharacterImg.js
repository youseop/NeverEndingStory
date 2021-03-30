import React from 'react'
import { message } from 'antd';
import { useDispatch } from "react-redux";
import { selectCharacter } from '../../../../../_actions/characterSelected_actions';

function CharacterImg({ character, index }) {
  const dispatch = useDispatch();

  const onClick_selectCharacter = () => {
    dispatch(selectCharacter({ ...character, index: index }));
  }

  const img = new Image();
  img.src = character.image_array[0];
  return (
    <div className="characterSidebar_box" onClick={onClick_selectCharacter}>
      <img
        src={character.image_array[0]}
        alt="img"
        className={img.width > img.height ?
          "characterSidebar_Image_width" : "characterSidebar_Image_height"}
      />
    </div>
  )
}

export default CharacterImg
