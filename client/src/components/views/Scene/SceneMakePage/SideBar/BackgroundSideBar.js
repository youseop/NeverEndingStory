import { Button } from 'antd';
import React, { memo } from 'react'
import './BackgroundSideBar.css'
import BackgroundImg from './BackgroundImg'
import './BackgroundSideBar.css'

function BackgroundSideBar({ gameDetail, setBackgroundImg, setMakeModalState }) {

  const renderBackground = gameDetail.background.map((background, index) => {
    return (
      <div
        className="backSidebar_box"
        key={`${index}`}
      >
        <BackgroundImg imgUrl={background.image} setBackgroundImg={setBackgroundImg} />
      </div>
    )
  })

  return (
    <div className="modal">
      <div className="backSidebar__container">
        {renderBackground}
      </div>
    </div>
  )
}

export default memo(BackgroundSideBar)
