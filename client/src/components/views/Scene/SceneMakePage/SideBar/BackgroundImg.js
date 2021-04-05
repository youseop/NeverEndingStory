import React from 'react'

function BackgroundImg({ imgUrl, setBackgroundImg }) {
  const onClick_img = () => {
    setBackgroundImg(imgUrl);
  }
  return (
    <div
      className="backSidebar_image_container"
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
