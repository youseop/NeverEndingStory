import { FileAddOutlined } from '@ant-design/icons';
import React, { memo, useEffect } from 'react'
import CharacterImg from './CharacterImg'
import './CharacterSideBar.css'


function CharacterSideBar({ gameDetail, setName, onSetModal, isFirstScene }) {

  const renderCharacter = gameDetail.character.map((character, index) => {
    return <div className="characterSidebar_box" key={`${index}`}>
      <CharacterImg
        character={character}
        index={index}
        setName={setName} />
    </div>
  })

  return (
    <div>
      {isFirstScene.current &&
        <FileAddOutlined onClick={onSetModal}
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
