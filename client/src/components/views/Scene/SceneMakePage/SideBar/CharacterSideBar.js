import { FileAddOutlined } from '@ant-design/icons';
import React, { memo, useEffect } from 'react'
import CharacterImg from './CharacterImg'
import './CharacterSideBar.css'


function CharacterSideBar({ gameDetail, setName, onSetModal }) {

  const renderCharacter = gameDetail.character.map((character, index) => {
    return (
      <div className="characterSidebar_box" key={`${index}`}>
        <CharacterImg
          character={character}
          index={index}
          setName={setName} />
      </div>
    )
  })

  return (
    <div>
      <div className="characterSidebar__container">
        {gameDetail?.character?.length === 0 &&
          <FileAddOutlined onClick={onSetModal}
            className="sidebar_add_esset_btn" />
        }
        {renderCharacter}
      </div>
      <div className="characterSidebar_line">
      </div>
    </div>
  )
}

export default memo(CharacterSideBar)
