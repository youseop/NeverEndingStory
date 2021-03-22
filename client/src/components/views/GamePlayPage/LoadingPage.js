import React, { useState } from "react";
import "./LoadingPage.css";
import { useSelector } from "react-redux";
const LOADING_TYPE = {
  NONE: 0,
  BASIC: 1,
  SLIDELEFT: 2,
  SLIDERIGHT: 3,
  SLIDEUP: 4,
  SLIDEDOWN: 5,
};

const LoadingPage = () => {
  const loadingType = useSelector((state) => state.gameplay.loadingType);
  switch (loadingType) {
    case LOADING_TYPE.NONE:
      return "";
    case LOADING_TYPE.BASIC:
      return (
        <div
          style={{ animation: "1.5s ease-out 0s 1 basic" }}
          className="loading_page"
        >
          <div className="loading_icon">loading.....</div>
        </div>
      );
    case LOADING_TYPE.SLIDELEFT:
      console.log("type 2")
      return (
        <div
          style={{ animation: "1s ease-out 0s 1 slideLeft" }}
          className="loading_page"
        />
      );
    case LOADING_TYPE.SLIDERIGHT:
      return (
        <div
          style={{ animation: "1s ease-out 0s 1 slideRight" }}
          className="loading_page"
        />
      );
    case LOADING_TYPE.SLIDEUP:
      return (
        <div
          style={{ animation: "1s ease-out 0s 1 slideUp" }}
          className="loading_page"
        />
      );
    case LOADING_TYPE.SLIDEDOWN:
      return (
        <div
          style={{ animation: "1s ease-out 0s 1 slideDown" }}
          className="loading_page"
        />
      );
    default:
      return "";
  }
};

export default LoadingPage;
