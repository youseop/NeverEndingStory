import { FileAddOutlined } from '@ant-design/icons';
import React, { memo, useEffect } from 'react'
import CharacterImg from './CharacterImg'
import './CharacterSideBar.css'


function CharacterSideBar({ gameDetail, setName, onEssetModal, isFirstScene }) {

  const renderCharacter = gameDetail.character.map((character, index) => {
    return(
      <CharacterImg
        character={character}
        key={index}
        index={index}
        setName={setName} />
    )
  })

  return (
    <div>
      {isFirstScene.current &&
        <FileAddOutlined onClick={onEssetModal}
          className={gameDetail?.character?.length === 0 ? "charSidebar_add_esset_btn" : "sidebar_add_esset_btn_side"} />
      }
      <div className="characterSidebar__container">
        {renderCharacter}
      </div>
      <div className="characterSidebar_line">
      </div>
    </div>
  )
}

export default memo(CharacterSideBar)
