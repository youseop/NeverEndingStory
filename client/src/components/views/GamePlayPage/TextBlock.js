import "./TextBlock.css";
import React, { useReducer, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { message } from "antd";
import InputModal from "../Modal/InputModal";
import TextAnimation from './TextAnimation'
import SceneEndingPage from "../Scene/SceneEndingPage/SceneEndingPage";
import { Click_Icon } from "../../svg/icon"
// 일단 4 나중에 어떻게 할지 다시 결정..
const CHOICE_NUM = 4;

export const TextBlock = (props) => {
    let { cut_name, cut_script, setIsTyping, isTyping, theme } = props;

    return <>
        <div className={`text_window ${theme}`} >
            {
                cut_script ?
                    <div className={`text_container ${theme}`} >
                        <div className={`name_block ${theme}`} >
                            {cut_name}
                        </div>
                        <div className={`text_block ${theme}`} >
                            <div className={`text_line ${theme}`} > {
                                isTyping ? < TextAnimation
                                    cut_script={cut_script}
                                    setIsTyping={setIsTyping}
                                /> : cut_script
                            }
                            </div>
                        </div>
                        {/* <div className="short_cut_box_container">
                            <div className="short_cut_box">
                            </div>
                        </div> */}
                    </div>
                    :
                    <>
                        <div className={`text_line ${theme}`} > {
                            isTyping ? < TextAnimation
                                cut_script={" "}
                                setIsTyping={setIsTyping}
                            /> : cut_script
                        }
                        </div>
                    </>
            }
            {!isTyping &&
                <div className={`click_icon_container ${theme}`}>
                    <Click_Icon />
                    <span>Click!</span>
                </div>
            }
        </div>
    </>
};

// 선택지 display
export const TextBlockChoice = (props) => {

    // 뭔가 한다..

    let {
        game_id,
        cut_name,
        cut_script,
        scene_next_list,
        scene_id,
        scene_depth,
        setIsTyping,
        isTyping,
        isEnding,
        isLastMotion,
        theme,
        setScene
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
            } key={index}
                style={{ textDecoration: 'none' }}
                className={`text_line_choice ${theme}`}
                onClick={() => setScene({})}
            >
                { choice.script}
            </Link>
        );
    });
    return (
        <div className={`text_window ${theme}`} >
            <TextBlock
                cut_name={cut_name}
                cut_script={cut_script}
                setIsTyping={setIsTyping}
                isTyping={isTyping}
                theme={theme}
            />
            { isLastMotion &&
                <div className={`choice_box ${isEnding} ${theme}`}>
                    {isEnding === true ?
                        <SceneEndingPage gameId={game_id} setScene={setScene} /> :
                        <>
                            {choices}
                            {scene_next_list.length < CHOICE_NUM ?

                                <InputModal scene_id={scene_id}
                                    scene_depth={scene_depth}
                                    game_id={game_id}
                                    scene_next_list={scene_next_list}
                                    theme={theme}
                                />
                                :
                                (<div > </div>)
                            }
                        </>
                    }
                </div>
            }
        </div>
    );
}
