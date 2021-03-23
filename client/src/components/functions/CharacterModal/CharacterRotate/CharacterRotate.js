import React, { useEffect, useState } from 'react';
import './CharacterRotate.css';

function CharacterRotate() {
  let pivot = [0, 0];
  let drag = false;

  function mouseDown(e) {
    pivot = [e.pageX, e.pageY];
    console.log('mousedown!',pivot)
    drag = true;
    e.preventDefault();
  }

  function mouseUp(e) {
    pivot = [e.pageX, e.pageY];
    console.log('mouseup!',pivot)
    drag = false;
    e.preventDefault();
  }

  function mouseMove(e) {
    // if (drag) {
    //   if (pivot[0] != e.pageX || pivot[1] != e.pageY) {
    //     position = [
    //       position[0] - (pivot[0] - e.pageX),
    //       position[1] - (pivot[1] - e.pageY),
    //     ];
    //     setPosition(position);
    //     pivot = [e.pageX, e.pageY];
    //   }
    // }
    e.preventDefault();
  }

  
  useEffect(() => {
    // const background_element = document.getElementsByClassName("CharacterBlocks");
    // console.log(background_element)
    const char_elements = document.getElementsByClassName("character__img");
    char_elements[0].addEventListener("mousedown", mouseDown);
    char_elements[0].addEventListener("mouseup", mouseUp);
    char_elements[0].addEventListener("mousemove", mouseMove);
    console.log(char_elements);
  },[])
  console.log(background_element.offsetWidth)


  return (
    <div className="controlSize__container">
      X
    </div>
  )
};

export default CharacterRotate
