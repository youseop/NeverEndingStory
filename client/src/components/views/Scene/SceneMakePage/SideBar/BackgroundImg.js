import React from 'react'

function BackgroundImg({ imgUrl, setBackgroundImg }) {

  const onClick_img = () => {
    setBackgroundImg(imgUrl);
  }
  // const img = new Image();
  // img.src = imgUrl;
  return (
    <div
      className="backSidebar_box"
      onClick={onClick_img}>
      <img
        src={imgUrl}
        alt="img"
        // className={img.width > img.height ?
        //   "backSidebar_Image_width" : "backSidebar_Image_height"}
        className="backSidebar_Image_width"
      />
    </div>
  )
}

export default BackgroundImg
