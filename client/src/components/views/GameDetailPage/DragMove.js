import React, { useEffect, useRef, useState } from "react";

export default function DragMove(props) {
  const {
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onDragMove,
    children,
    style,
    className
  } = props;

  const element = useRef();

  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e) => {
    setIsDragging(true);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      onDragMove(e);
    }
  };

  // useEffect(() => {
  //   element.current.addEventListener('touchmove', handlePointerMove, false);
  // },[])

  return (
    <div
      ref={element}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
}