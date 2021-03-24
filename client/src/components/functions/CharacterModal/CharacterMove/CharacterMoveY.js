import React, { memo, useEffect, useState } from 'react';
import './CharacterMoveY.css';

function CharacterMoveY({setCharacterList, index, element}) {
  let pivotY = 0;
  let drag = false;

  function mouseDown(e) {
    pivotY = e.pageY;
    drag = true;
    e.preventDefault();
  }

  function mouseUp(e) {
    pivotY = e.pageY;
    drag = false;
    e.preventDefault();
  }

  function mouseMove(e) {
    if (drag) {
      if (pivotY != e.pageY) {
        setCharacterList((oldArray)=> {
          const background_height = document.getElementById("backgroundImg_container").offsetHeight;
          const prev_posY = oldArray[index].posY;
          const next_posY = prev_posY + 100*(e.pageY-pivotY)/background_height;
          return [...oldArray.slice(0,index), {...oldArray[index], posY: next_posY} ,...oldArray.slice(index+1,4)]
        })
        pivotY = e.pageY;
      }
    }
    e.preventDefault();
  }

  
  useEffect(() => {
    const char_element = document.getElementById(`${index}`);
    char_element.addEventListener("mousedown", mouseDown);
    char_element.addEventListener("mouseup", mouseUp);
    char_element.addEventListener("mousemove", mouseMove);
  },[index])


  return (
    <div className="controlSize__container"></div>
  )
}

export default memo(CharacterMoveY)
