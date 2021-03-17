import "./TextBlock.css";
import React, { useReducer } from "react";
import { Link, useHistory } from "react-router-dom";
import { message } from "antd";
import InputModal from "../Modal/InputModal";
import Typewriter from 'typewriter-effect';

// 일단 4 나중에 어떻게 할지 다시 결정..
const CHOICE_NUM = 4;

export const TextBlock = (props) => {
    const { cut_name, cut_script } = props;
    return (
        <div className="text_container">
            <div className="name_block">{cut_name}</div>
            <hr className="text_line"></hr>
            <br/>
            <div className="text_block">
            <Typewriter
              options={{
                strings: cut_script,
                autoStart: true,
                loop: false,
                delay: 10,
                cursor: ""
              }}
            />
              {/* {cut_script} */}
              </div>
        </div>
    );
};

// 선택지 display
export const TextBlockChoice = (props) => {
    const {
        game_id,
        cut_name,
        cut_script,
        scene_next_list,
        scene_id,
        scene_depth,
    } = props;
    const choices = scene_next_list.map((choice, index) => {
        return (
            <Link
                to={`/gameplay/${game_id}/${choice.sceneId}`}
                key={`${index}`}
            >
                {choice.script} <br />
            </Link>
        );
    });
    return (
        <div className="text_container">
            <div className="name_block">{cut_name}</div>
            <hr className="text_line"></hr>
            <div className="text_block">
                {cut_script}
                <br />
                {/* 선택의 길이 등장할 수 있는 경우 */}
                <div>{choices}</div>
                <br />
                {scene_next_list.length < CHOICE_NUM ? (
                    // <div onClick={onClick_nextScene}>
                    <div>
                        {/* 선택의길... <br /> */}
                        <InputModal
                            scene_id={scene_id}
                            scene_depth={scene_depth}
                            game_id={game_id}
                        />
                    </div>
                ) : (
                    <div></div>
                )}
                {/* 항상 */}
            </div>
        </div>
    );
};
