import "./SceneSimulation.css";
import CharacterBlock from "../../GamePlayPage/CharacterBlock";
import { TextBlock, TextBlockChoice } from "../../GamePlayPage/TextBlock.js";
import React, { useState } from "react";
import useKey from "../../../functions/useKey";
//?미완
var bgm_audio = new Audio();
var sound_audio = new Audio();

// playscreen
const SceneSimulation = ({CutList, onClick_simulation}) => {

  const [i, setI] = useState(0);

    function playMusic(i) {
        if (CutList[i].bgm.music) {
            //이전 곡과 같은 bgm이 아니라면
            if (
                !(
                    i > 0 &&
                    CutList[i - 1].bgm.music == CutList[i].bgm.music
                )
            ) {
                bgm_audio.pause();
                bgm_audio.src = CutList[i].bgm.music;
                bgm_audio.play();
            }
        }
        if (CutList[i].sound.music) {
            sound_audio.pause();
            sound_audio.src = CutList[i].sound.music;
            sound_audio.play();
        }
    }

    function handleEnter() {
        if (i < CutList.length - 1) {
            playMusic(i + 1);
            setI(i + 1);
        }
    }

    useKey("Enter", handleEnter);
    useKey("Space", handleEnter);

    if (i == 0) playMusic(0);


    return (
        <div className="container">
            <div className="productscreen">
                <div className="background_img_container">
                    <button
                        className="HistoryMap_btn"
                        onClick={onClick_simulation}//?돌아가기로 수정
                    >
                        돌아가기
                    </button>
                    <img
                        className="background_img"
                        src={CutList[i].background}
                        alt="Network Error"
                    />
                    <CharacterBlock
                        characterCnt={CutList[i].characterCnt}
                        characterList={CutList[i].characterList}
                    />

                        <TextBlock
                            cut_name={CutList[i].name}
                            cut_script={CutList[i].script}
                        />

                    {/* {i === CutList.length - 1 ? (
                        <TextBlockChoice
                            cut_name={CutList[i].name}
                            cut_script={CutList[i].script}
                        />
                    ) : (
                        <TextBlock
                            cut_name={CutList[i].name}
                            cut_script={CutList[i].script}
                        />
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default SceneSimulation;
