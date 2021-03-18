import "./GamePlayPage.css";
import CharacterBlock from "./CharacterBlock";
import { TextBlock, TextBlockChoice } from "./TextBlock.js";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import DislikePopup from "./Dislike";
import HistoryMapPopup from "./HistoryMap";
import { message } from "antd";
import useKey from "../../functions/useKey";

var bgm_audio = new Audio();
var sound_audio = new Audio();

// playscreen
const ProductScreen = (props) => {
  const { gameId } = props.match.params;
  const { sceneId } = props.match.params;
  
  const padding = 0.1;
  const minSize = 300;

  const [ratio, setRatio] = useState(0.5);
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  const [windowHeight, setwindowHeight] = useState(window.innerHeight);  

  const [i, setI] = useState(0);
  const [Scene, setScene] = useState({});
  const [Dislike, setDislike] = useState(false);
  const [History, setHistory] = useState({})
  const [HistoryMap, setHistoryMap] = useState(false);

    function playMusic(i) {
        if (Scene.cutList[i].bgm.music) {
            //이전 곡과 같은 bgm이 아니라면
            if (
                !(
                    i > 0 &&
                    Scene.cutList[i - 1].bgm.music == Scene.cutList[i].bgm.music
                )
            ) {
                bgm_audio.pause();
                bgm_audio.src = Scene.cutList[i].bgm.music;
                bgm_audio.play();
            }
        }
        if (Scene.cutList[i].sound.music) {
            sound_audio.pause();
            sound_audio.src = Scene.cutList[i].sound.music;
            sound_audio.play();
        }
    }

    function handleEnter() {
        if (i < Scene.cutList.length - 1) {
            playMusic(i + 1);
            setI(i + 1);
        }
    }

    useKey("Enter", handleEnter);
    useKey("Space", handleEnter);

    useEffect(() => {
        Axios.get(`/api/game/getnextscene/${gameId}/${sceneId}`).then((response) => {
                if (response.data.success) {
                    const history = { gameId: gameId, sceneId: response.data.sceneIdList };
                    setHistory(history)
                    setI(0);
                    setScene(response.data.scene);
                } else {
                    message.error("Scene 정보가 없습니다.");
                }
            }
        );
        
        const variable = { gameId: gameId };
        Axios.post("/api/game/ratio", variable).then((response) => {
            if (response.data.success) {
                if (response.data.ratio) {
                    setRatio(parseFloat(response.data.ratio));
                } else {
                    message.error("배경화면의 비율 정보가 존재하지 않습니다. 2:1로 초기화 합니다.");
                }
            } else {
                message.error("Scene 정보가 없습니다.");
            }
        });
    }, [sceneId]);

    useEffect(() => {
      function handleResize() {
        setwindowWidth(window.innerWidth);
        setwindowHeight(window.innerHeight);
      //   console.log(windowWidth,windowHeight,'/',window.innerWidth,window.innerHeight)
      }
      window.addEventListener('resize', handleResize)
    });

    let newScreenSize;
    if ( windowWidth * ratio > windowHeight  ) {
        newScreenSize = {
        width:`${windowHeight * (1-2*padding) / ratio}px`,
        height:`${windowHeight * (1-2*padding)}px`,
        minWidth: `${minSize / ratio}px`,
        minHeight: `${minSize}px`
        }
    } else {
        newScreenSize = {
        width:`${windowWidth * (1-2*padding)}px`,
        height:`${windowWidth * (1-2*padding) * ratio}px`,
        minWidth: `${minSize}px`,
        minHeight: `${minSize * ratio}px`
        }
    }

    if (Scene.cutList) {
        if (i == 0) playMusic(0);

        return (
            <div>
                <div className="productscreen">
                    <div className="background_img_container"
                        style={newScreenSize}>
                        <img
                            className="background_img"
                            src={Scene.cutList[i].background}
                            alt="Network Error"
                        />
                        <CharacterBlock
                            characterCnt={Scene.cutList[i].characterCnt}
                            characterList={Scene.cutList[i].characterList}
                        />

                        {i === Scene.cutList.length - 1 ? (
                            <TextBlockChoice
                                game_id={gameId}
                                cut_name={Scene.cutList[i].name}
                                cut_script={Scene.cutList[i].script}
                                scene_depth={Scene.depth}
                                scene_id={Scene._id}
                                scene_next_list={Scene.nextList}
                            />
                        ) : (
                            <TextBlock
                                cut_name={Scene.cutList[i].name}
                                cut_script={Scene.cutList[i].script}
                            />
                        )}
                        <HistoryMapPopup
                            history={History}
                            trigger={HistoryMap}
                            setTrigger={setHistoryMap}
                        />
                    </div>
                </div>
                <button onClick={() => setDislike(state => !state)}>신고</button>
                <button
                    onClick={() => setHistoryMap(state => !state)}
                >
                    미니맵
                </button>
                <DislikePopup 
                    sceneId={sceneId}
                    gameId={gameId}
                    trigger={Dislike} 
                    setTrigger={setDislike} />
            </div>
        );
    } else {
        return <div>now loading..</div>;
    }
};

export default ProductScreen;
