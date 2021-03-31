import React, { memo, useEffect, useState } from 'react';
import { updateCharacter } from '../../../../_actions/characterSelected_actions';
import './CharacterSize.css';

function CharacterSize({index, element}) {
  const dispatch = useDispatch();
  const CharacterList = useSelector(state => state.character.CharacterList)
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
        const img_height = element.current.offsetHeight;
          const prev_size = oldArray[index].size;
          const next_size = prev_size*(img_height-(pivotX-e.pageX))/img_height;
        dispatch(updateCharacter({
          oldArray: CharacterList,
          data: {
            size: next_size
          },
          index
        }))
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
