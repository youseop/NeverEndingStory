import React from 'react'

function BackgroundImg({imgUrl, setBackgroundImg}) {

  const onClick_img = () => {
    setBackgroundImg(imgUrl);
  }

  return (
    <div onClick={onClick_img}>
      <img src={`${imgUrl}`} alt="img"/>
    </div>
  )
}

export default BackgroundImg
