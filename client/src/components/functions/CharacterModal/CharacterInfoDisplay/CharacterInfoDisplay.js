import { message } from 'antd';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pushCharacter, selectCharacter, setCharacterList } from '../../../../_actions/characterSelected_actions';
import { useConstructor } from '../../useConstructor';
import './CharacterInfoDisplay.css';

function CharacterInfoDisplay({ setName, character, GameCharacterList }) {
  const dispatch = useDispatch();
  const CharacterList = useSelector(state => state.character.CharacterList)

  const onClick_putCharacter = (index, url) => {
    const characterSchema = {
      index: character.index,
      image: url,
      posX: 30,
      posY: 15,
      reverse: 0,
      size: 90,
    }
    dispatch(pushCharacter({ oldArray: CharacterList, characterSchema }))
    setName(character?.name)
  }

  const onClick_selectCharacter = (index) => {
    setName(GameCharacterList[index].name)
    dispatch(selectCharacter({ ...GameCharacterList[index], index: index }));
  }

  const CharacterListImages = CharacterList?.map((character, index) => {
    // const img = new Image();
    // img.src = character.image;
    return (
      <div key={index}>
        <div
          className="characterList_Info"
          onClick={() => { onClick_selectCharacter(character.index) }}
        >
          <img
            src={character?.image}
            alt=""
            // className={img.height > img.width ?
            //   "characterList_image_height" : "characterList_image_width"}
            className="characterList_image_height"
          />
          {/* <div className="characterList_Text">
        x: {character.posX} y: {character.posY} size: {character.size}
      </div> */}
        </div>
        <div>{character?.name}이름 삭제</div>
      </div>
    )
  })

  const characterDetailImages = character?.image_array?.map((url, index) => {
    const isIn = CharacterList?.some(item => item.image === url);
    const selected = isIn ? "selected" : "";
    return (
      <div
        key={index}
        className={`image_array__box ${selected}`}
        onClick={() => { onClick_putCharacter(index, url) }}
      >
        <img
          src={url}
          id={index}
          className="image_array_image"
          alt=""
        // onLoad={() => {
        //   if (document.getElementById(index).naturalWidth > document.getElementById(index).naturalHeight) {
        //     document.getElementById(index).className = "image_array_image_width"
        //   } else {
        //     document.getElementById(index).className = "image_array_image_height"
        //   }
        // }}
        />
      </div>
    )
  })

  return (
    <div className="image_array__container">
      {/* <div className="characterList__container">
        {CharacterListImages}
      </div> */}
      {characterDetailImages}
    </div>
  )
}

export default memo(CharacterInfoDisplay)
