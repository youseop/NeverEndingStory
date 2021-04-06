import { FileAddOutlined } from '@ant-design/icons';
import React, { memo, useEffect } from 'react'
import CharacterImg from './CharacterImg'
import './CharacterSideBar.css'


function CharacterSideBar({ gameDetail, setName, onEssetModal, isFirstScene, isWriter }) {

  const renderCharacter = gameDetail.character.map((character, index) => {
    return (
      <CharacterImg
        key={index}
        character={character}
        index={index}
        setName={setName} />
    )
  })

  return (
    <div>
      {(isFirstScene.current || isWriter) &&
        <div className="sidebar__container">
          <FileAddOutlined onClick={onEssetModal}
            className={gameDetail?.character?.length === 0 ?
              "sidebar_add_esset_btn" : "sidebar_add_esset_btn_side"} />
        </div>
      }
      {(gameDetail?.character?.length !== 0) &&
        <div className="characterSidebar__container">
          {renderCharacter}
        </div>
      }
      <div className="sidebar_line">
      </div>
    </div>
  )
}

export default memo(CharacterSideBar)
