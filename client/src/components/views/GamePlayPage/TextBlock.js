import "./TextBlock.css";
import React from 'react'
import { Link } from "react-router-dom";

export const TextBlock = (props) => {
  const { line_text } = props;
  return (
    <div className="text_container">
      <div className="name_block">아이유</div>
      <hr className="text_line"></hr>
      <div className="text_block">{line_text}</div>
    </div>
  );
};

export const TextBlockChoice = (props) => {
  const { line_text, scene_next_list } = props;
  const onclickHandler = () => {
    console.log("hi");
  };

  const choices = scene_next_list.map((choice) => {
    return choice.text ? (
      <Link to={`/gameplay/${choice.id}`}>
        {choice.text} <br />
      </Link>
    ) : (
      <Link to={`/make/${choice.id}`}>
        선택의길... <br />
      </Link>
    );
  });

  return (
    <div className="text_container">
      <div className="name_block">아이유</div>
      <hr className="text_line"></hr>
      <div className="text_block">
        {line_text}
        <div>{choices}</div>
      </div>
    </div>
  );
};
