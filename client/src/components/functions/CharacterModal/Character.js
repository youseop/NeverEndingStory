import React, { useRef, memo, useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './Character.css';
import { useDispatch, useSelector } from 'react-redux';
import { popCharacter, selectCharacter, updateCharacter, orderCharacter, toggleCharacter } from '../../../_actions/characterSelected_actions';
import { addEvent, removeAllEvents } from '../handleEventListener';
import { faAngleDoubleDown, faAngleDown, faTimes, faTimesCircle, faArrowsAltH } from '@fortawesome/free-solid-svg-icons';
import { useConstructor } from '../useConstructor';

function Character(props) {
  const dispatch = useDispatch();
  const CharacterList = useSelector(state => state.character.CharacterList)

  const { charSchema, GameCharacterList, index, setName } = props;

  const element_X = useRef();
  const element_Y = useRef();


  const [clicked, setClicked] = useState(true);
  const [moving, setMoving] = useState(true);
  const [sizing, setSizing] = useState(false);
  const [imgWidth, setImgWidth] = useState(0);
  const [zIndex, setZIndex] = useState(96);

  const background_element = document.getElementById("backgroundImg_container");

  let pivot = [0, 0];
  let drag = false;
  // const isPortrait = window.matchMedia('(pointer: coarse)').matches;


  useEffect(() => {
    if (!background_element) {
      return;
    }
    setImgWidth(document.getElementById(`${index}`).offsetWidth);
    return () => {
      removeAllEvents(background_element, "mousemove");
      removeAllEvents(background_element, "mouseup");
      removeAllEvents(background_element, "touchmove");
      removeAllEvents(background_element, "touchend");
    }
  }, [CharacterList])


  function onMouseDown(e, option) {
    if (!background_element || e.target !== e.currentTarget) {
      return;
    }
    if (option === 'mouse') {
      addEvent(background_element, "mousemove", (e) => { mouseMove(e, 'mouse') }, false);
      addEvent(background_element, "mouseup", onMouseUp, false);
      pivot = [e.pageX, e.pageY];
    } else {
      addEvent(background_element, "touchmove", (e) => { mouseMove(e, 'touch') }, false);
      addEvent(background_element, "touchend", onMouseUp, false);
      pivot = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    }
    drag = true;
    dispatch(selectCharacter({ ...GameCharacterList[charSchema.index], index: charSchema.index }));
    setZIndex(97);
    setName(GameCharacterList[charSchema.index]?.name);
    if (e.cancelable) {
      e.preventDefault();
    }
  }


  function mouseMove(e, option) {
    if (e.cancelable) {
      let page;
      if (option === 'mouse') {
        page = [e.pageX, e.pageY];
      } else {
        page = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
      }
      if (drag && clicked && moving) {
        if (pivot[0] - page[0] > 3 || pivot[1] - page[1] > 3 || pivot[0] - page[0] < -3 || pivot[1] - page[1] < -3) {
          const background_width = background_element.offsetWidth;
          const background_height = background_element.offsetHeight;
          const prev_posX = Number(element_X.current.style.left.replace(/%/g, ''));
          const prev_posY = Number(element_Y.current.style.top.replace(/%/g, '').replace(/px/g, ''));
          const next_posX = prev_posX + 100 * (page[0] - pivot[0]) / background_width;
          const next_posY = prev_posY + 100 * (page[1] - pivot[1]) / background_height;
          element_X.current.style.left = String(next_posX) + '%';
          element_Y.current.style.top = String(next_posY) + '%';
          pivot = page;
        }
      } else if (drag && clicked && sizing) {
        if (pivot[0] - page[0] > 7 || pivot[0] - page[0] < -7) {
          const image_width = document.getElementById(`${index}`).offsetWidth;
          const prev_size = Number(element_Y.current.style.height.replace(/%/g, ''));
          let next_size = 0;
          if (pivot[0] - page[0] < 0) {
            next_size = prev_size * (image_width - 1 * (pivot[0] - page[0])) / image_width;
          } else {
            next_size = prev_size * (image_width - 1 * (pivot[0] - page[0])) / image_width;
          }
          if (next_size > 20) {
            element_Y.current.style.height = String(next_size) + '%';
          }
          pivot = page;
        }
      }
      setImgWidth(document.getElementById(`${index}`).offsetWidth);
      e.stopPropagation()
      e.preventDefault()
    }
  }


  const onMouseUp = (e) => {
    removeAllEvents(background_element, "mousemove");
    removeAllEvents(background_element, "mouseup");
    removeAllEvents(background_element, "touchmove");
    removeAllEvents(background_element, "touchend");
    const dataToSubmit = {
      oldArray: CharacterList,
      data: {
        posX: Number(element_X.current.style.left.replace(/%/g, '')),
        posY: Number(element_Y.current.style.top.replace(/%/g, '').replace(/px/g, '')),
        size: Number(element_Y.current.style.height.replace(/%/g, ''))
      },
      index
    };
    dispatch(updateCharacter(dataToSubmit))
    pivot = [e.pageX, e.pageY];
    drag = false;
    setSizing(false);
    setMoving(true);
    setZIndex(96)
    dispatch(orderCharacter({
      oldArray: CharacterList ? updateCharacter(dataToSubmit).payload : null,
      index: charSchema.index,
      num: "pull"
    }))
  }


  const onMouseOver = (e) => {
    setMoving(false);
    setSizing(true);
    e.stopPropagation();
  }


  const onMouseOut = (e) => {
    setMoving(true);
    setSizing(false);
    e.stopPropagation();
  }


  const onClickDelete = (e) => {
    e.stopPropagation();
    dispatch(popCharacter({ oldArray: CharacterList, index: charSchema.index }));
  }


  const onClickOrder = (num) => {
    dispatch(orderCharacter({ oldArray: CharacterList, index: charSchema.index, num }));
  }

  const onClickToggle = (num) => {
    dispatch(toggleCharacter({ oldArray: CharacterList, index: charSchema.index }));
  }

  return (
    <div
      ref={element_X}
      key={index}
      className="CharacterBlock"
      style={{ left: `${charSchema.posX}%`, zIndex: `${zIndex}` }}
    >
      <div
        ref={element_Y}
        className="character__container"
        style={{
          height: `${charSchema.size}%`,
          top: `${charSchema.posY}%`
        }}
      >
        <img
          className={charSchema.reverse ?
            "characterImg_clicked reverse" : "characterImg_clicked"}
          id={`${index}`}
          src={charSchema.image}
          alt="img"
          onMouseDown={(e) => { onMouseDown(e, "mouse") }}
          onTouchStart={(e) => { onMouseDown(e, "touch") }}
        />
        {imgWidth &&
          <>
            <FontAwesomeIcon
              icon={faTimesCircle}
              className="bttn btn_character_delete"
              style={{ left: `${imgWidth - 17}px` }}
              onClick={onClickDelete}
            />
            <FontAwesomeIcon
              icon={faAngleDoubleDown}
              className="bttn btn_character_Doubledown"
              style={{ left: `${imgWidth - 34}px` }}
              onClick={(e) => {
                onClickOrder("double")
              }}
            />
            <FontAwesomeIcon
              icon={faAngleDown}
              className="bttn btn_character_down"
              style={{ left: `${imgWidth - 51}px` }}
              onClick={(e) => {
                onClickOrder("")
              }}
            />
            <div
              className={`${sizing ? "bttn btn_sizing_clicked" : "bttn btn_sizing"}`}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onMouseDown={(e) => {onMouseDown(e,"mouse")}}
              style={{ left: `${imgWidth - 3}px` }}
            ></div>
          </>
        }
      </div>
    </div>
  )
}

export default memo(Character)
