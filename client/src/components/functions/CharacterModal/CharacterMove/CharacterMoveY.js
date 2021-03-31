import React, { memo, useEffect, useState } from 'react';
import { updateCharacter } from '../../../../_actions/characterSelected_actions';
import './CharacterMoveY.css';

function CharacterMoveY({ index, element }) {
  const dispatch = useDispatch();
  const CharacterList = useSelector(state => state.character.CharacterList)
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
    console.log(CharacterList);
    if (drag) {
      if (pivotY != e.pageY) {
        const background_height = document.getElementById("backgroundImg_container").offsetHeight;
        const prev_posY = oldArray[index].posY;
        const next_posY = prev_posY + 100 * (e.pageY - pivotY) / background_height;
        dispatch(updateCharacter({
          oldArray: CharacterList,
          data: {
            posY: next_posY
          },
          index
        }))
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
  }, [index])


  return (
    <div className="controlSize__container"></div>
  )
}

export default memo(CharacterMoveY)
