import React from 'react'

function BackgroundImg({imgUrl, setImg}) {

  const onClick_img = () => {
    setImg(imgUrl);
  }

  return (
    <div onClick={onClick_img}>
      <img src={`${imgUrl}`} alt="img"/>
    </div>
  )
}

export default BackgroundImg
