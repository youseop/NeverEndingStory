import { message } from 'antd';
import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { selectCharacter } from '../../../../_actions/characterSelected_actions';
import './CharacterInfoDisplay.css';

function CharacterInfoDisplay({ setName, character, setCharacterList, CharacterList, GameCharacterList }) {
  const dispatch = useDispatch();

  const onClick_putCharacter = (index, url) => {
    const CharacterSchema = {
      index: character.index,
      image: url,
      posX: 30,
      posY: 15,
      reverse: 0,
      size: 90,
    }
    setCharacterList((oldArray) => {
      for (let i = 0; i < oldArray.length; i++) {
        if (oldArray[i].index === character.index)
          return [...oldArray.slice(0, i), { ...oldArray[i], image: url }, ...oldArray.slice(i + 1, 4)]
      }
      if (oldArray.length >= 3) {
        message.info("인물은 최대 세명까지 추가 가능합니다.");
        return oldArray;
      }
      return [...oldArray, CharacterSchema]
    })
    setName(character.name)
  }

  const onClick_selectCharacter = (index) => {
    setName(GameCharacterList[index].name)
    dispatch(selectCharacter({ ...GameCharacterList[index], index: index }));
  }

  const CharacterListImages = CharacterList.map((character, index) => {
    // const img = new Image();
    // img.src = character.image;
    return (
      <div key={index}>
        <div
          className="characterList_Info"
          onClick={() => { onClick_selectCharacter(character.index) }}
        >
          <img
            src={character.image}
            alt=""
            // className={img.height > img.width ?
            //   "characterList_image_height" : "characterList_image_width"}
            className="characterList_image_height"
          />
          {/* <div className="characterList_Text">
        x: {character.posX} y: {character.posY} size: {character.size}
      </div> */}
        </div>
        <div>{character.name}이름 삭제</div>
      </div>
    )
  })

  const characterDetailImages = character.image_array.map((url, index) => {
    // const img = new Image();
    // img.src = url;
    return (
      <div
        key={index}
        className="image_array__box"
        onClick={() => { onClick_putCharacter(index, url) }}
      >
        <img
          src={url}
          alt=""
          // className={img.height > img.width ?
          //   "image_array_image_height" : "image_array_image_width"}
          className="image_array_image_height"
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
