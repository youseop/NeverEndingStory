import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detachCharacter, selectCharacter } from '../../../_actions/characterSelected_actions';
import Character from './Character';
import CharacterInfoDisplay from './CharacterInfoDisplay/CharacterInfoDisplay';
import './CharacterModal.css';

function CharacterModal({setCharacterList, CharacterList, GameCharacterList, setName}) {
  const dispatch = useDispatch();

  const onClick_detachCharacter = () => {
    dispatch(detachCharacter());
  }

  const currentCharacter = useSelector((state) => state.character);
  
  const onClick_removeCharacter = () => {
    setCharacterList((oldArray) => {
      for (let i = 0; i < oldArray.length; i++) {
        if (oldArray[i].index === currentCharacter.characterSelected.index) {
          message.info("삭제되었습니다.");
          return [...oldArray.slice(0, i), ...oldArray.slice(i + 1, 4)]
        }
      }
    })
    setName("")
  }

  const [isAdded,setIsAdded] = useState(false);

  useEffect(() => {
    let flag = 0;
    for(let i = 0; i<CharacterList.length; i++){
      if (CharacterList[i].index === currentCharacter.characterSelected.index){
        flag = 1;
        break;
      }
    }
    if(flag === 1){
      setIsAdded(true);
    } else {
      setIsAdded(false);
    }

  },[currentCharacter, CharacterList])

  return (
      <div className="modal_Character">
        <div onClick={onClick_detachCharacter}>캐릭터 선택 해제</div>
        {isAdded && <div onClick={onClick_removeCharacter}>삭제</div>}
        <CharacterInfoDisplay 
          setName={setName}
          GameCharacterList={GameCharacterList}
          character={currentCharacter.characterSelected} 
          setCharacterList={setCharacterList}
          CharacterList={CharacterList}
      />
      </div>
  )
}

export default CharacterModal
