import React from "react";

const svg = {
  arrow_1:
    "M-1.73589e-06 5.2875L16.6883 22.5L-2.31124e-07 39.7125L5.13765 45L27 22.5L5.13765 -2.24574e-07L-1.73589e-06 5.2875Z",
  playIcon_1:
    "M0.497437 0.796925V17.5524L15.8567 9.17468L0.497437 0.796925Z"
};

export function SVG(props) {
  const { src, color, width, height } = props;
  return (
    <svg
      width={width ? width : "auto"}
      height={height ? height : "auto"}
      viewBox="0 0 27 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={svg[src]} fill={color} />
    </svg>
  );
}

export function BAR(props) {
  return (
    <svg
      width="15"
      height="3"
      viewBox="0 0 15 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="15" height="3" fill="white" />
    </svg>
  );
}