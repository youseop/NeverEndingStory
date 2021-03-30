import React from "react";

const svg = {
  arrow_1:
    "M-1.73589e-06 5.2875L16.6883 22.5L-2.31124e-07 39.7125L5.13765 45L27 22.5L5.13765 -2.24574e-07L-1.73589e-06 5.2875Z",
  close_1:
  "M11 0C4.917 0 0 4.917 0 11C0 17.083 4.917 22 11 22C17.083 22 22 17.083 22 11C22 4.917 17.083 0 11 0ZM16.5 14.949L14.949 16.5L11 12.551L7.051 16.5L5.5 14.949L9.449 11L5.5 7.051L7.051 5.5L11 9.449L14.949 5.5L16.5 7.051L12.551 11L16.5 14.949Z",
  close_2:
  "M10 0.600006C4.47 0.600006 0 5.07001 0 10.6C0 16.13 4.47 20.6 10 20.6C15.53 20.6 20 16.13 20 10.6C20 5.07001 15.53 0.600006 10 0.600006ZM15 14.19L13.59 15.6L10 12.01L6.41 15.6L5 14.19L8.59 10.6L5 7.01001L6.41 5.60001L10 9.19001L13.59 5.60001L15 7.01001L11.41 10.6L15 14.19Z"
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
