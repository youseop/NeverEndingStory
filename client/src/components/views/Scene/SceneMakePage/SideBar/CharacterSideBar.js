import { Button } from 'antd';
import React, { memo, useEffect } from 'react'
import './CharacterSideBar'

import CharacterImg from './CharacterImg'

function CharacterSideBar({ gameDetail, setCharacterList, setMakeModalState, setName }) {

  const renderCharacter = gameDetail.character.map((character, index) => {
    return <div className="character" key={`${index}`}>
      <CharacterImg
        character={character}
        index={index}
        setCharacterList={setCharacterList}
        setName={setName} />
    </div>
  })

  const setModal = () => {
    setMakeModalState(1);
  }

  return (
    <div className="sidebar__container">
      <Button
        type="primary"
        style={{ fontSize: "15px" }}
        onClick={setModal}>
        추가
      </Button>
      <div>{renderCharacter}</div>
    </div>
  )
}

export default memo(CharacterSideBar)
