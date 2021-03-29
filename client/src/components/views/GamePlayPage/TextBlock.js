import "./TextBlock.css";
import React, { useReducer } from "react";
import { Link, useHistory } from "react-router-dom";
import { message } from "antd";
import InputModal from "../Modal/InputModal";
import TextAnimation from './TextAnimation'

// 일단 4 나중에 어떻게 할지 다시 결정..
const CHOICE_NUM = 4;

export const TextBlock = (props) => {
  const { cut_name, cut_script, setIsTyping, isTyping } = props;
  return (
    <div className="text_window">

      <div className="text_container">
        <div className="name_block">{cut_name}</div>
        <div className="text_block">
          <div className="text_line">
            {
              isTyping ? <TextAnimation
                cut_script={cut_script}
                setIsTyping={setIsTyping}
              /> : cut_script
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// 선택지 display
export const TextBlockChoice = (props) => {

  // 뭔가 한다..

  const {
    game_id,
    cut_name,
    cut_script,
    scene_next_list,
    scene_id,
    scene_depth,
    setIsTyping,
    isTyping,
  } = props;

  const choices = scene_next_list.map((choice, index) => {
    return (
      <Link to={
        {
          pathname: `/gameplay`,
          key: index,
          state: {
            gameId: game_id,
            sceneId: choice.sceneId
          }
        }
      } key={index} style={{ textDecoration: 'none' }} className="text_line_choice">
        {choice.script}
      </Link>
    );
  });
  return (
    <div className="text_window">
      <div className="text_container">
        <div className="name_block">{cut_name}</div>
        <div className="text_block">
          <div className="text_line">
            {
              isTyping ? <TextAnimation
                cut_script={cut_script}
                setIsTyping={setIsTyping}
              /> : cut_script
            }
          </div>
        </div>
      </div>
      <div class="choice_box">
        {choices}
        {scene_next_list.length < CHOICE_NUM ? (
          <InputModal
            scene_id={scene_id}
            scene_depth={scene_depth}
            game_id={game_id}
            scene_next_list={scene_next_list}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
