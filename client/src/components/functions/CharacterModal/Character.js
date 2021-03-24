import React, { useRef, memo, useState, useEffect } from 'react';
import CharacterModal from './CharacterModal';
import './Character.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectCharacter } from '../../../_actions/characterSelected_actions';
import CharacterSize from './CharacterSize/CharacterSize';
import CharacterMoveX from './CharacterMove/CharacterMoveX';
import CharacterMoveY from './CharacterMove/CharacterMoveY';
import { selectMovingTarget } from '../../../_actions/movingTarget_actions';
import {addEvent, removeAllEvents} from '../handleEventListener';

function Character(props) {
  const dispatch = useDispatch();
  const { charSchema, GameCharacterList, setCharacterList , index, CharacterList } = props;
  
  const element_X = useRef();
  const element_Y = useRef();

  const [clicked,setClicked] = useState(true);
  const [moving, setMoving] = useState(true);
  const [sizing, setSizing] = useState(false);

  const background_element = document.getElementById("backgroundImg_container");

  let pivot = [0,0];
  let drag = false;

  function mouseMove(e) {
    const page = [e.pageX,e.pageY];
    if (drag && clicked && moving) {
      if (pivot[0]-e.pageX>3 || pivot[1]-e.pageY>3 || pivot[0]-e.pageX<-3 || pivot[1]-e.pageY<-3) {
        
        const background_width = background_element.offsetWidth;
        const background_height = background_element.offsetHeight;
        const prev_posX = Number(element_X.current.style.left.replace( /%/g, '' ));
        const prev_posY = Number(element_Y.current.style.top.replace( /%/g, '' ).replace( /px/g, '' ));
        const next_posX = prev_posX + 100*(e.pageX-pivot[0])/background_width;
        const next_posY = prev_posY + 100*(e.pageY-pivot[1])/background_height;
        element_X.current.style.left = String(next_posX)+'%';
        element_Y.current.style.top = String(next_posY)+'%';
        pivot = page;
      }
    } else if (drag && clicked && sizing) {
      if (pivot[0] != e.pageX) {
        const img_height = element_Y.current.offsetHeight;
        const prev_size = Number(element_Y.current.style.height.replace( /%/g, '' ));
        const next_size = prev_size*(img_height-(pivot[1]-page[1]))/img_height;
        if (next_size > 20){
          element_Y.current.style.height = String(next_size)+'%';
        }
        pivot = page;
      }
    }
    e.stopPropagation()
    e.preventDefault()
  }

  useEffect(() => {
    addEvent(background_element, "mousemove", mouseMove, false);
    return () => {
      removeAllEvents(background_element, "mousemove");
    }
  }, [])

  const onMouseEnter_initMoving = () => {
    // addEvent(background_element, "mousemove", mouseMove, false);
  }

  const onMouseDown_selectMovingTarget = (e) => {
    addEvent(background_element, "mousemove", mouseMove, false);
    pivot = [e.pageX,e.pageY];
    drag = true;
  }

  const onMouseUp_detachMovingTarget = (e) => {
    setCharacterList((oldArray)=> {
      return [
        ...oldArray.slice(0,index), 
        {...oldArray[index], posX: Number(element_X.current.style.left.replace( /%/g, '' )), posY: Number(element_Y.current.style.top.replace( /%/g, '' ).replace( /px/g, '' ))},
        ...oldArray.slice(index+1,4)
      ]
    })
    setCharacterList((oldArray)=> {
      return [...oldArray.slice(0,index), {...oldArray[index], size: Number(element_Y.current.style.height.replace( /%/g, '' ))} ,...oldArray.slice(index+1,4)]
    })
    pivot = [e.pageX,e.pageY];
    drag = false;
    setSizing(false);
    dispatch(selectCharacter({...GameCharacterList[charSchema.index], index: charSchema.index}));
  }


  return (
    <div 
      ref={element_X}
      key={index} 
      className="CharacterBlock"
      style={{ left: `${charSchema.posX}%`}}
    >
      <div 
        ref={element_Y}
        className="character__container"
        style={{height: `${charSchema.size}%`,
                top: `${charSchema.posY}%`}}
      >
          <img
            onMouseEnter={onMouseEnter_initMoving}
            onMouseDown={onMouseDown_selectMovingTarget}
            onMouseUp={onMouseUp_detachMovingTarget}
            className={`${clicked ? "characterImg_clicked" : "characterImg"}`}
            id={`${index}`}
            src={charSchema.image}
            alt="img"
          />
          {clicked &&
          <div 
            className={`${moving ? "btn_moving_clicked" : "btn_moving"}`} 
            onClick={() => {setMoving((state)=>!state);setSizing(false)}}
          >위치 조절</div>
          }
          {clicked &&
          <div 
            className={`${sizing ? "btn_sizing_clicked" : "btn_sizing"}`} 
            onClick={() => {setMoving(false);setSizing((state)=>!state)}}
          >사이즈 조절</div>
          }
      </div>
    </div>
  )
}

export default memo(Character)
