import React from 'react'
import { message } from 'antd';

function CharacterImg({ imgUrl, setCharacterList, CharacterList }) {

  let limit = 0;
  const onClick_setCharacter = () => {
    setCharacterList(oldArray => (limit = oldArray.length) < 3 ? [...oldArray, imgUrl] : oldArray)
    if (limit === 3)
      message.error('인물은 최대 세명까지 가능합니다.')
  }

  return (
    <div>
      <div onClick={onClick_setCharacter}>
        <img src={`${imgUrl}`} alt="img" />
      </div>
    </div>
  )
}

export default CharacterImg
