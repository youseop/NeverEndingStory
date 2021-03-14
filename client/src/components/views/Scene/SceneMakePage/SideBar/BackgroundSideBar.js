import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import './BackgroundSideBar.css'

import BackgroundImg from './BackgroundImg'

function BackgroundSideBar({gameId, setImg}) {
  
  const [Background, setBackground] = useState([]);
  
  const variable = { gameId: gameId }
  useEffect(() => {
    Axios.post('/api/game/getgamedetail',variable)
    .then(response => {
      if(response.data.success) {
        setBackground(response.data.gameDetail.background);
      } else {
        alert('게임 정보를 로딩하는데 실패했습니다.')
      }
    })
  },[])


  const renderBackground = Background.map((background, index) => {
    return <div className="background">
      <BackgroundImg imgUrl={background.image} setImg={setImg}/>
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
