import React from 'react'
import './CharacterImg.css'

function CharacterImg({imgUrl, setCharacterList, CharacterList}) {

  const onClick_setCharacter = () => {
    if(CharacterList.length < 3){
      setCharacterList(oldArray => [...oldArray, imgUrl])
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
