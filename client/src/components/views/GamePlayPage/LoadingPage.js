import React, { useState } from "react";
import "./LoadingPage.css";
import { useSelector } from "react-redux";

const LOADING_TYPE = {
  NONE : 0,
  SLIDELEFT : 1
}

const LoadingPage = () => {
  const loadingType = useSelector((state) => state.gameplay.loadingType);
  console.log(loadingType);
  switch(loadingType){
    case LOADING_TYPE.NONE:
      return ("")
    case LOADING_TYPE.SLIDELEFT:
      return <div className="gameloading_page" div />
    default:
      return ("")
  }
  // return loadingType ? <div className="gameloading_page" div /> : "";
};

export default LoadingPage;
