import React from 'react'
import './CharacterImg.css'
import { message } from 'antd';

function CharacterImg({imgUrl, setCharacterList, CharacterList}) {

  const onClick_setCharacter = () => {
    if(CharacterList.length < 3){
      setCharacterList(oldArray => [...oldArray, imgUrl])
    }
    else{
      message.error('인물은 최대 세명까지 가능합니다.');
    }
  }

  return (
    <div>
    <div className="character__wrapper" onClick={onClick_setCharacter}>
      <img className="character__main" src={`${imgUrl}`} alt="img"/>
    </div>
    </div>
  )
}

export default CharacterImg
