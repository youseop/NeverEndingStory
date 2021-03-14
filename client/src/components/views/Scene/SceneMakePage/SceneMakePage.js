import React, { useState } from 'react'
import BackgroundSideBar from './SideBar/BackgroundSideBar'
import CharacterSideBar from './SideBar/CharacterSideBar'
import './SceneMakePage.css'

function SceneMakePage(props) {
  const gameId = props.match.params.gameId;

  const [SidBar_b, setSidBar_b] = useState(false);
  const [SidBar_c, setSidBar_c] = useState(false);

  const onClick_b = () => {
    setSidBar_b(true)
    setSidBar_c(false)
  }

  const onClick_c = () => {
    setSidBar_b(false)
    setSidBar_c(true)
  }

  const [Img, setImg] = useState("");

  return (
    <div className="scenemake__container">
      <div className="scenemake__main">
        <div className="main_img">
          {Img ? 
          <img className="img" src={`${Img}`} alt="img"/>
          :
          <div>오른쪽의 이미지를 클릭하세요</div>
          }
          
        </div>

      </div>
      <div className="scenemake__toggleBar">
        {SidBar_b && <BackgroundSideBar gameId={gameId} setImg={setImg}/>}
        {SidBar_c && <CharacterSideBar/>}
      </div>
      <div className="scenemake__toggleButton_container">
        <div className="scenemake__btn" onClick={onClick_b}>b</div>
        <div className="scenemake__btn" onClick={onClick_c}>c</div>
      </div>
    </div>
  )
}

export default SceneMakePage
