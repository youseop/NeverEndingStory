import Axios from 'axios';
import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import './BackgroundSideBar.css'

import BackgroundImg from './BackgroundImg'

function BackgroundSideBar({gameId, setBackgroundImg}) {
  
  const [Background, setBackground] = useState([]);
  
  const variable = { gameId: gameId }
  useEffect(() => {
    Axios.post('/api/game/getgamedetail',variable)
    .then(response => {
      if(response.data.success) {
        if(response.data.gameDetail.background.length === 0){
          message.error('배경사진이 없습니다.');
        }
        else{
          setBackground(response.data.gameDetail.background);
        }
      } else {
        alert('게임 정보를 로딩하는데 실패했습니다.')
      }
    })
  },[])


  const renderBackground = Background.map((background, index) => {
    return <div className="background" key={`${index}`}>
      <BackgroundImg imgUrl={background.image} setBackgroundImg={setBackgroundImg}/>
      {/* <img src={`${background.image}`} alt="img"/> */}
    </div>
  })

  return (
    <div className="sidebar__container">
      {Background && <div>{renderBackground}</div>}
    </div>
  )
}

export default BackgroundSideBar
