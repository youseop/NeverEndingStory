import { Button } from 'antd';
import React, { useEffect } from 'react'
import './CharacterSideBar'

import CharacterImg from './CharacterImg'

function CharacterSideBar({ gameDetail, setCharacterList, CharacterList, setMakeModalState }) {

  const renderCharacter = gameDetail.character.map((character, index) => {
    return <div className="character" key={`${index}`}>
      <CharacterImg imgUrl={character.image_array[0]} CharacterList={CharacterList} setCharacterList={setCharacterList} />
    </div>
  })

  const setModal = () => {
    setMakeModalState(1);
  }

  return (
    <div className="sidebar__container">
      <Button onClick={setModal} type="primary" style={{ background: "black" }}>
        추가
      </Button>
      <div>{renderCharacter}</div>
    </div>
  )
}

export default CharacterSideBar
