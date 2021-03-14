import React from 'react'

function CharacterImg({imgUrl, setCharacterList, CharacterList}) {

  const onClick_setCharacter = () => {
    if(CharacterList.length < 3){
      setCharacterList(oldArray => [...oldArray, imgUrl])
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
