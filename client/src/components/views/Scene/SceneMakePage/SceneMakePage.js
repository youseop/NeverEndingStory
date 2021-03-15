import React, { useEffect, useState } from 'react'
import BackgroundSideBar from './SideBar/BackgroundSideBar'
import CharacterSideBar from './SideBar/CharacterSideBar'
import './SceneMakePage.css'

import { Input, message, Button } from 'antd';
import { STATES } from 'mongoose';
const {TextArea} = Input


function SceneMakePage(props) {
  const gameId = props.match.params.gameId;

  const [SidBar_b, setSidBar_b] = useState(false);
  const [SidBar_c, setSidBar_c] = useState(false);
  const [SidBar_script, setSidBar_script] = useState(false);

  const [BackgroundImg, setBackgroundImg] = useState("");
  const [CharacterList, setCharacterList] = useState([]);
  const [Script, setScript] = useState("");
  const [Name, setName] = useState("");

  const [CutNumber, setCutNumber] = useState(-1);

  const [Cut, setCut] = useState({
    BackgroundImg: "",
    CharacterList: [],
    Script: "",
    Name: ""
  });

  const [CutList, setCutList] = useState([]);

  const onScriptChange = (event) => {
    setScript(event.currentTarget.value)
  }

  const onNameChange = (event) => {
    setName(event.currentTarget.value)
  }

  const onClick_background = () => {
    setSidBar_b(true)
    setSidBar_c(false)
  }

  const onClick_character = () => {
    setSidBar_b(false)
    setSidBar_c(true)
  }
  
  const onClick_script = () => {
    if(SidBar_script){
      setSidBar_script(false);
    } else {
      setSidBar_script(true);
    }
  }

  const onClick_GotoCut = (index) => {
    // setCutNumber(index);
    setBackgroundImg(CutList[index].BackgroundImg);
    setCharacterList(CutList[index].CharacterList);
    setScript(CutList[index].Script);
    setName(CutList[index].Name);
  }

  const onRemove_character = (index) => {
    setCharacterList(oldArray => [
      ...oldArray.slice(0,index), ...oldArray.slice(index+1,4)
    ])
 };

  const onSubmit_nextCut = (event) => {
    event.preventDefault();
    // if(Script==="" || Name ===""){
    //   message.error('이름과 대사는 필수 항목입니다.');
    //   return
    // }
    setCut({
      BackgroundImg: BackgroundImg,
      CharacterList: CharacterList,
      Script: Script,
      Name: Name
    })
    setScript("");
  }
  
  useEffect(()=>{
    setCutList(oldArray => [
      ...oldArray.slice(0,CutNumber), Cut, ...oldArray.slice(CutNumber+1,30)
    ])
    setCutNumber(oldNumber => oldNumber+1);
  },[Cut])

  // useEffect(() => {
  //   console.log(CutList)
  // },[CutList])


  const display_SceneBox = CutList.map((Cut, index) => {
    return (
      <div>
        <div className="scene__SceneBox" key={`${index}`} onClick={() => onClick_GotoCut(index)}></div>
      </div>
    )
  })

  const display_Character = CharacterList.map((characterUrl, index) => {
    return (
    <div className="scene__characterBox" key={`${index}`} onClick={() => onRemove_character(index)}>
      <img className="scene__character" src={`${characterUrl}`} alt="character"/>
    </div>
    )
  })

  return (
    <div className="scenemake__container">
    {/* //?main Screen */}
      <div className="scenemake__main">
        <div className="scene__SceneBox_container">{display_SceneBox}</div>
        <div className="scenemake__main_img">
          {BackgroundImg ? 
          <img className="scenemake__background" src={`${BackgroundImg}`} alt="img"/>
          :
          <div></div>
          }
          <div className="scenemake__character_container">
            {display_Character}
          </div>    
          {SidBar_script && 
          <div className="scenemake__main_script">
            <Input 
              onChange={onNameChange} 
              value={Name}
            />
            <TextArea 
              onChange={onScriptChange}
              value={Script}
            />
          </div> 
          }
        </div>
        <div className="scenemake__btn_container">
          <Button type="primary" onClick={onSubmit_nextCut}>
          Next(Cut)
          </Button>
        </div>
      </div>
      {/* //?toggleBar */}
      <div className="scenemake__toggleBar">
        {SidBar_b && <BackgroundSideBar gameId={gameId} setBackgroundImg={setBackgroundImg}/>}
        {SidBar_c && <CharacterSideBar gameId={gameId} CharacterList={CharacterList} setCharacterList={setCharacterList}/>}
      </div>
      <div className="scenemake__toggleButton_container">
        <div className="scenemake__btn_sidebar" onClick={onClick_background}>b</div>
        <div className="scenemake__btn_sidebar" onClick={onClick_character}>c</div>
        <div className="scenemake__btn_sidebar" onClick={onClick_script}>s</div>
      </div>
    </div>
  )
}

export default SceneMakePage
