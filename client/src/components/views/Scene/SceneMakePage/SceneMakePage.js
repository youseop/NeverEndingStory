import React, { useState } from 'react'
import BackgroundSideBar from './SideBar/BackgroundSideBar'
import CharacterSideBar from './SideBar/CharacterSideBar'
import './SceneMakePage.css'

function SceneMakePage(props) {
  const gameId = props.match.params.gameId;

  const [SidBar_b, setSidBar_b] = useState(false);
  const [SidBar_c, setSidBar_c] = useState(false);
  const [BackgroundImg, setBackgroundImg] = useState("");
  const [CharacterList, setCharacterList] = useState([]);

  const onClick_background = () => {
    setSidBar_b(true)
    setSidBar_c(false)
  }

  const onClick_character = () => {
    setSidBar_b(false)
    setSidBar_c(true)
  }

  const onRemove = (index) => {
    setCharacterList(oldArray => [
      ...oldArray.slice(0,index), ...oldArray.slice(index+1,4)
    ])
 };

  const displayCharacter = CharacterList.map((characterUrl, index) => {
    console.log(index)
    return (
    <div key={`${index}`} onClick={() => onRemove(index)}>
      <img src={`${characterUrl}`} alt="character"/>
    </div>
    )
  })

  return (
    <div className="scenemake__container">
      <div className="scenemake__main">
        <div className="scenemake__imgWrapper">
          {BackgroundImg ? 
          <img className="scenemake__img" src={`${BackgroundImg}`} alt="img"/>
          :
          <div>오른쪽의 이미지를 클릭하세요</div>
          }
        </div>
        <div className="main_character">{displayCharacter}</div>     
      </div>
      <div className="scenemake__toggleBar">
        {SidBar_b && <BackgroundSideBar gameId={gameId} setBackgroundImg={setBackgroundImg}/>}
        {SidBar_c && <CharacterSideBar gameId={gameId} CharacterList={CharacterList} setCharacterList={setCharacterList}/>}
      </div>
      <div className="scenemake__toggleButton_container">
        <div className="scenemake__btn" onClick={onClick_background}>b</div>
        <div className="scenemake__btn" onClick={onClick_character}>c</div>
      </div>
    </div>
  )
}

export default SceneMakePage
