import { Button } from 'antd';
import React from 'react'
import './BackgroundSideBar.css'
import BackgroundImg from './BackgroundImg'

function BackgroundSideBar({ gameDetail, setBackgroundImg, setMakeModalState }) {

  const renderBackground = gameDetail.background.map((background, index) => {
    return <div className="background" key={`${index}`}>
      <BackgroundImg imgUrl={background.image} setBackgroundImg={setBackgroundImg} />
    </div>
  })

  const setModal = () => {
    setMakeModalState(2);
  }

  return (
    <div className="sidebar__container">
      <Button onClick={setModal} type="primary" style={{ background: "black" }}>
        추가
      </Button>
      <div>{renderBackground}</div>
    </div>
  )
}

export default BackgroundSideBar
