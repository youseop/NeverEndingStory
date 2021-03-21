import { message } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import './CharacterSideBar'

import CharacterImg from './CharacterImg'

function CharacterSideBar({gameId, setCharacterList, CharacterList}) {
  
  const [Character, setCharacter] = useState([]);
  
  const variable = { gameId: gameId }
  useEffect(() => {
    Axios.post('/api/game/getgamedetail',variable)
    .then(response => {
      if(response.data.success) {
        if(response.data.gameDetail.character.length === 0){
          // TODO: 이 메세지가 아얘 찍히지 않도록 처리해줍시다.
          message.error('캐릭터 사진이 없습니다.');
        }
        else{
          setCharacter(response.data.gameDetail.character);
        }
      } else {
        alert('게임 정보를 로딩하는데 실패했습니다.')
      }
    })
  },[])

  const renderCharacter = Character.map((character, index) => {
    return <div className="character" key={`${index}`}>
      <CharacterImg imgUrl={character.image} CharacterList={CharacterList} setCharacterList={setCharacterList}/>
    </div>
  })

  return (
    <div className="sidebar__container">
      {Character && <div>{renderCharacter}</div>}
    </div>
  )
}

export default CharacterSideBar
