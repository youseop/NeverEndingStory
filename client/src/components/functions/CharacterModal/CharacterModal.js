import { message } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detachCharacter } from '../../../_actions/characterSelected_actions';
import CharacterInfoDisplay from './CharacterInfoDisplay/CharacterInfoDisplay';
import './CharacterModal.css';

function CharacterModal({setCharacterList}) {
  const dispatch = useDispatch();

  const onClick_detachCharacter = () => {
    dispatch(detachCharacter());
  }

  const currentCharacter = useSelector((state) => state.character);

  const onClick_removeCharacter = () => {
    setCharacterList((oldArray) => {
      for(let i = 0; i < oldArray.length; i++){
        if(oldArray[i].index === currentCharacter.characterSelected.index){
          message.info("삭제되었습니다.");
          return [...oldArray.slice(0, i), ...oldArray.slice(i + 1, 4)]
        }
      }
    })
  }

  return (
      <div className="modal_Character">
        <div onClick={onClick_detachCharacter}>캐릭터 선택 해제</div>
        <div onClick={onClick_removeCharacter}>삭제</div>
        <CharacterInfoDisplay character={currentCharacter.characterSelected} setCharacterList={setCharacterList}/>
      </div>
  )
}

export default CharacterModal
