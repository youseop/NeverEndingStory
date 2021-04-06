import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SVG } from "../../../svg/icon";
import "./Search.css";
import { searchControl } from "../../../../_actions/controlPage_actions";

export default function Search() {
  const dispatch = useDispatch();
  const searchOn = useSelector((state) => state.controlpage.searchOn);

  const [SearchOn, setSearchOn] = useState(false);
  const textInputRef = useRef(null);

  const onClickHandler = () => {
    setSearchOn(true);
    textInputRef.current.focus();
  };

  const offClickHandler = () => {
    setSearchOn(false);
    textInputRef.current.value = "";
  };

  const onChangeHandler = () => {
    dispatch(searchControl(textInputRef.current.value));
  };

  if (SearchOn) {
    return (
      <div className="search-container-on">
        <div className="search-icon" onClick={() => offClickHandler()}>
          <SVG src="search_1" width="100%" height="100%" color="#F5F5F5" />
        </div>
        <input
          className="search-textinput-on"
          ref={textInputRef}
          onChange={() => onChangeHandler()}
        />
      </div>
    );
  } else {
    return (
      <div className="search-container-off">
        <div
          className="search-icon"
          onClick={() => {
            onClickHandler();
          }}
        >
          <SVG src="search_1" width="100%" height="100%" color="#F5F5F5" />
        </div>
        <input
          className="search-textinput-off"
          ref={textInputRef}
        />
      </div>
    );
  }
}
