import { message } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { selectCharacter } from '../../../../_actions/characterSelected_actions';
import './CharacterInfoDisplay.css';

function CharacterInfoDisplay({setName, character, setCharacterList, CharacterList, GameCharacterList}) {
  const dispatch = useDispatch();

  const onClick_putCharacter = (index,url) => {
    const CharacterSchema = {
      index: character.index,
      image: url,
      posX: 0,
      posY: 0,
      reverse: 0,
      size: 50,
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
    dispatch(selectCharacter({...GameCharacterList[index], index: index}));
  }

  const CharacterListImages = CharacterList.map((character,index) => {
    return (
    <div key={index} 
      className="characterList_Info" 
      onClick={() => {onClick_selectCharacter(character.index)}}
    >
      <img src={character.image} alt="" className="characterList_Image"/>
      <div className="characterList_Text">
        x: {character.posX} y: {character.posY} size: {character.size}
      </div>
    </div>
    )
  })

  const characterDetailImages = character.image_array.map((url, index) => {
    return( 
      <div key={index} onClick={() => {onClick_putCharacter(index,url)}}>
        <img src={url} alt="img"/>
      </div>
    )
  })

  return (
    <div className="characterInfo__container">
      <div className="characterList__container">
        {CharacterListImages}
      </div>
      <div>이름 : {character.name}</div>
      <div>정보 : {character.description}</div>
      <img src={character.image_array[0]} alt="" className="main_img"/>
      <div className="image_array__container">{characterDetailImages}</div>
    </div>
  )
}

export default CharacterInfoDisplay
