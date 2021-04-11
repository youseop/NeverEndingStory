import React from 'react'
import { LOCAL_HOST } from "../../../../Config";


const config = require("../../../../../config/key")

function BackgroundImg({ imgUrl, setBackgroundImg, curImg, setReload }) {
  const onClick_img = () => {
    if (curImg !== imgUrl) {
      setBackgroundImg(imgUrl);
    } else {
      setBackgroundImg(`${config.STORAGE}/uploads/defaultBackground.png`);
    }
    setReload(reload => reload + 1);
  }
  return (
    <div
      className={`backSidebar_image_container ${curImg === imgUrl}`}
      onClick={onClick_img}>
      <img
        src={imgUrl}
        alt="img"
        className="backSidebar_image"
      />
    </div>
  )
}

export default BackgroundImg
