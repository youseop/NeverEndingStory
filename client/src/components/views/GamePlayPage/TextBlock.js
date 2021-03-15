import "./TextBlock.css";
import React from 'react'
import { Link } from "react-router-dom";
import { message } from "antd";

export const TextBlock = (props) => {
  const { cut_name, cut_script } = props;
  return (
    <div className="text_container">
      <div className="name_block">{cut_name}</div>
      <hr className="text_line"></hr>
      <div className="text_block">{cut_script}</div>
    </div>
  );
};

export const TextBlockChoice = (props) => {
  const { gameId,cut_name, cut_script, scene_next_list } = props;
  const choices = scene_next_list.map((choice) => {
    return choice.text ? (
      <Link to={`/gameplay/${gameId}/${choice.id}`} key={`${choice.id}`}>
        {choice.text} <br />
      </Link>
    ) : (
      <Link to={`/scene/make/${choice.id}`} key={`${choice.id}`} onClick={() => message.info('게임을 제작해주세요.')}>
        선택의길... <br />
      </Link>
    );
  });

  return (
    <div className="text_container">
      <div className="name_block">{cut_name}</div>
      <hr className="text_line"></hr>
      <div className="text_block">
        {cut_script}
        <div>{choices}</div>
      </div>
    </div>
  );
};
