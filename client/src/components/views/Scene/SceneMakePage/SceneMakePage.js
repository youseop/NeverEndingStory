import React, { useEffect, useState } from 'react'
import BackgroundSideBar from './SideBar/BackgroundSideBar'
import CharacterSideBar from './SideBar/CharacterSideBar'
import './SceneMakePage.css'
import {useSelector} from 'react-redux'
import { Input, message, Button } from 'antd';
import Axios from 'axios';
const {TextArea} = Input




function SceneMakePage(props) {
  // const firstUpdate = useRef(true);

  const gameId = props.match.params.gameId;
  const userId = useSelector(state=>state.user);
  // console.log(userId)
  const [SidBar_b, setSidBar_b] = useState(false);
  const [SidBar_c, setSidBar_c] = useState(false);
  const [SidBar_script, setSidBar_script] = useState(false);

  const [BackgroundImg, setBackgroundImg] = useState("");
  const [CharacterList, setCharacterList] = useState([]);
  const [Script, setScript] = useState("");
  const [Name, setName] = useState("");

  const [CutNumber, setCutNumber] = useState(0);

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

  const saveCut = () => {
    const Cut = {
      background: BackgroundImg,
      characterList: CharacterList,
      script: Script,
      name: Name
    }
    setCutList(oldArray => [
      ...oldArray.slice(0,CutNumber), Cut, ...oldArray.slice(CutNumber+1,30)
    ])
  }

  const displayCut = (index) => {
    setBackgroundImg(CutList[index].background);
    setCharacterList(CutList[index].characterList);
    setScript(CutList[index].script);
    setName(CutList[index].name);
  }

  const onClick_GotoCut = (index) => {
    // console.log("CutNumber :" ,CutNumber ,"Index :", index)
    if(CutNumber !== index){
      saveCut();
      displayCut(index);
      setCutNumber(index);
    }

  }

  const onRemove_character = (index) => {
    setCharacterList(oldArray => [
      ...oldArray.slice(0,index), ...oldArray.slice(index+1,4)
    ])
 };

  const onSubmit_nextCut = (event) => {
    // console.log("submit!! Cutnumber : ",CutNumber)
    event.preventDefault();
    
    saveCut();
    
    if(CutNumber < CutList.length-1){
      displayCut(CutNumber+1)
    }
    else{
      setScript("");
      
    }
    setCutNumber(oldNumber => oldNumber+1);
  }

  const onSubmit_saveScene = (event) => {
    event.preventDefault();
    // saveCut();

    const submitCut = {
      background: BackgroundImg,
      characterList: CharacterList,
      script: Script,
      name: Name
    }
    const submitCutList = [...CutList.slice(0,CutNumber), submitCut,
      ...CutList.slice(CutNumber+1,30)]

    if(window.confirm("하이~ ㅋㅋ")){
      // alert("제출합니다")
      const variable = {
        gameId : gameId,
        writer : userId.userData._id,
        nextList :[],
        cutList : submitCutList,
        isFirst : 1
      }
      // console.log(variable.writer)
      Axios.post('/api/scene/save',variable)
      .then(response => {
        if(response.data.success){
          message.success("제출이 완료되었습니다.")
          setTimeout(() => {
            props.history.push('/');
          },1000);
        }
        else{
          message.error("DB에 문제가 있습니다.")
        }
      })

    }
    else{
      alert("제출 취소요")
    }
    
 
  }
  
  // useEffect(() => {
  //   console.log(CutList)
  // },[CutList])


  const display_SceneBox = CutList.map((Cut, index) => {
    return (
        <div className="scene__SceneBox" key={`${index}`} onClick={() => onClick_GotoCut(index)}></div>
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
          <Button type="primary" onClick={onSubmit_saveScene}>
          Submit
          </Button>
          {/* <ModalSubmit/> */}
          
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
