import { FileAddOutlined } from '@ant-design/icons';
import React, { memo } from 'react'
import './BackgroundSideBar.css'
import BackgroundImg from './BackgroundImg'
import './BackgroundSideBar.css'

function BackgroundSideBar({ gameDetail, curImg, setBackgroundImg, onEssetModal, isFirstScene, setReload, isWriter }) {

  const renderBackground = gameDetail.background.map((background, index) => {
    return (
      <div
        className="backSidebar_box"
        key={`${index}`}>
        <BackgroundImg
          imgUrl={background.image}
          setBackgroundImg={setBackgroundImg}
          curImg={curImg}
          setReload={setReload}
        />
      </div>
    )
  })

  return (
    <div className="modal">
      <div className="backSidebar__container">
        {(isFirstScene.current || isWriter) &&
          <FileAddOutlined onClick={onEssetModal}
            className={gameDetail?.background?.length === 0 ?
              "sidebar_add_esset_btn" : "sidebar_add_esset_btn_side"} />
        }
        {gameDetail?.bgm?.length === 0 && <div className="sidebar_line" />}
        {renderBackground}
      </div>
    </div>
  )
}

export default memo(BackgroundSideBar)
