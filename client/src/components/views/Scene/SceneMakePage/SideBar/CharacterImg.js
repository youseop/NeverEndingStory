import React from 'react'
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
    <div onClick={onClick_setCharacter}>
      <img src={`${imgUrl}`} alt="img"/>
    </div>
    </div>
  )
}

export default CharacterImg
