import "./TextBlock.css";
import React from 'react'
import { Link } from "react-router-dom";
import { message } from "antd";

// 일단 4 나중에 어떻게 할지 다시 결정..
const CHOICE_NUM = 4;

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
  console.log("fuck~~~~~~~~~");
  const { gameId, cut_name, cut_script, scene_next_list } = props;
  const choices = scene_next_list.map((choice) => {
    return (
      <Link to={`/gameplay/${gameId}/${choice.id}`} key={`${choice.id}`}>
        {choice.text} <br />
      </Link>
<<<<<<< HEAD
    )
=======
    ) : (
      <Link to={`/scene/make/${choice.id}`} key={`${choice.id}`} onClick={() => message.info('게임을 제작해주세요.')}>
        선택의길... <br />
      </Link>
    );
>>>>>>> 54ae982b87311f3759dbd09fe2abc758a653105a
  });

  return (
    <div className="text_container">
      <div className="name_block">{cut_name}</div>
      <hr className="text_line"></hr>
      <div className="text_block">
        {cut_script}
        <br/>
        {scene_next_list.length < CHOICE_NUM ? <Link to={`/make/`}>
          선택의길... <br />
        </Link> : <div></div>}
        <div>{choices}</div>
      </div>
    </div>
  );
};
