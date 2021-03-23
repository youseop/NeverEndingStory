import React, { memo, useEffect, useState } from 'react';
import './CharacterSize.css';

function CharacterSize({setCharacterList, index, element}) {
  let pivotX = 0;
  let drag = false;
  function mouseDown(e) {
    pivotX = e.pageX;
    drag = true;
    e.preventDefault();
  }

  function mouseUp(e) {
    pivotX = e.pageX;
    drag = false;
    e.preventDefault();
  }

  function mouseMove(e) {
    if (drag) {
      if (pivotX != e.pageX) {
        setCharacterList((oldArray)=> {
          const img_height = element.current.offsetHeight;
          const prev_size = oldArray[index].size;
          const next_size = prev_size*(img_height-(pivotX-e.pageX))/img_height;
          return [...oldArray.slice(0,index), {...oldArray[index], size: next_size} ,...oldArray.slice(index+1,4)]
        })
        pivotX = e.pageX;
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
};

export default memo(CharacterSize)
