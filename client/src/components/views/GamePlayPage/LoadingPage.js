import React, { useState } from "react";
import "./LoadingPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { faSpinner, faTruckLoading } from "@fortawesome/free-solid-svg-icons";
const LOADING_TYPE = {
  NONE: 0,
  BASIC: 1,
  SLIDELEFT: 2,
  SLIDERIGHT: 3,
  SLIDEUP: 4,
  SLIDEDOWN: 5,
  BLACKIN: 6,
};

const LoadingPage = () => {
  const loadingType = useSelector((state) => state.gameplay.loadingType);
  switch (loadingType) {
    case LOADING_TYPE.NONE:
      return null;
    case LOADING_TYPE.BASIC:
      return (
        <div
          style={{ animation: "1.5s ease-out 0s 1 basic" }}
          className="loading_page"
        >
          <FontAwesomeIcon
              icon={faSpinner}
              className="loading_icon"
            />
        </div>
      );
    case LOADING_TYPE.SLIDELEFT:
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
    case LOADING_TYPE.BLACKIN:
      return (
        <div
          style={{ animation: "1s ease-out 0s 1 blackIn" }}
          className="loading_page"
        />
      );
    default:
      return null;
  }
};

export default LoadingPage;
