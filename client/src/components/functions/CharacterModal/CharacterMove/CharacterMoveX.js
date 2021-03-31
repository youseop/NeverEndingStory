import React, { memo, useEffect, useState } from 'react';
import { updateCharacter } from '../../../../_actions/characterSelected_actions';
import './CharacterMoveX.css';

function CharacterMoveX({ posX, index, element }) {
  const dispatch = useDispatch();
  const CharacterList = useSelector(state => state.character.CharacterList)
  let pivotX = 0;
  let drag = false;

  const CharacterBlock_elem = document.getElementsByClassName('CharacterBlock')[0];
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
        const background_width = document.getElementById("backgroundImg_container").offsetWidth;
        const prev_posX = CharacterList[index].posX;
        const next_posX = prev_posX + 100 * (e.pageX - pivotX) / background_width;
        dispatch(updateCharacter({
          oldArray: CharacterList,
          data: {
            posX: next_posX
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
  }, [index])


  return (
    <div className="controlSize__container"></div>
  )
}

export default memo(CharacterMoveX)
