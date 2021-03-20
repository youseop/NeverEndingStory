import React, { useEffect, useRef, useState } from "react";
import BackgroundSideBar from "./SideBar/BackgroundSideBar";
import CharacterSideBar from "./SideBar/CharacterSideBar";
import BgmSideBar from "./SideBar/BgmSideBar";
import SoundSideBar from "./SideBar/SoundSideBar";
import "./GamePlusScene.css";
import { useSelector } from "react-redux";
import { Input, message, Button, Switch } from "antd";
import Axios from "axios";
import { useLocation } from "react-router";
import useKey from "../../../functions/useKey";
import CharacterBlock from "../../GamePlayPage/CharacterBlock";
import { TextBlock } from "../../GamePlayPage/TextBlock";
import { useDispatch } from "react-redux";
import LoadingPage from "../../GamePlayPage/LoadingPage";
import { gameLoadingPage } from "../../../../_actions/gamePlay_actions";
import SceneBox from "./SceneBox/SceneBox";

const {TextArea} = Input;

var bgm_audio = new Audio();
var sound_audio = new Audio();

function SceneMakePage(props) {
    const dispatch = useDispatch();
    const location = useLocation();

    const sceneInfo = location.state;
    const gameId = props.match.params.gameId;
    const userId = useSelector((state) => state.user);

    const [IsLoading, setIsLoading] = useState(false);
    
    const [SidBar_script, setSidBar_script] = useState(true);

    const [BackgroundImg, setBackgroundImg] = useState("");
    const [CharacterList, setCharacterList] = useState([]);
    const [Script, setScript] = useState("");
    const [Name, setName] = useState("");
    const [BgmFile, setBgmFile] = useState({
        name: "",
        music: "",
    });
    const [SoundFile, setSoundFile] = useState({
        name: "",
        music: "",
    });

    useEffect(() => {
        if (sceneInfo){
            const variable = { sceneId : location.state.prev_scene_id};
            Axios.post("/api/scene/scenedetail", variable)
            .then((response) => {
                if (response.data.success) {
                    const lastCut = response.data.lastCut;
                    setBackgroundImg(lastCut.background);
                    setCharacterList(lastCut.characterList);
                    // setScript(lastCut.script);
                    setName(lastCut.name);
                    
                    dispatch(gameLoadingPage(0)); 
                    dispatch(gameLoadingPage(1));
                } else {
                    message.error("이전 Scene의 정보를 불러오는데 실패했습니다.")
                }
            })
        }
        setIsLoading(true)
    },[])

    useEffect(() => {
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
    }, [])

    const [CutNumber, setCutNumber] = useState(0);
    const [Hover, setHover] = useState(false);

    const [CutList, setCutList] = useState([]);
    const [EmptyCutList, setEmptyCutList] = useState(
        Array.from({ length: 30 }, () => 0)
    );

    // 첫 씬과 나머지 씬들의 차이
    const [SceneOption, setSceneOption] = useState(
        sceneInfo ? sceneInfo.scene_option : ""
    );

    const onScriptChange = (event) => {
        setScript(event.currentTarget.value);
    };

    const onNameChange = (event) => {
        setName(event.currentTarget.value);
    };

    const backgroundSidebarElement = useRef();
    const characterSidebarElement = useRef();
    const bgmSidebarElement = useRef();
    const soundSidebarElement = useRef();

    const makeVisible = (element) => {
        makeInvisible()
        element.current.style.display = 'block'
    }

    const makeInvisible = () => {
        backgroundSidebarElement.current.style.display = 'none'
        characterSidebarElement.current.style.display = 'none'
        bgmSidebarElement.current.style.display = 'none'
        soundSidebarElement.current.style.display = 'none'
    }


    const onClick_background = () => {
        if (backgroundSidebarElement.current.style.display === 'none') {
            makeVisible(backgroundSidebarElement);
        } else {
            makeInvisible();
        }
    };

    const onClick_character = () => {
        if (characterSidebarElement.current.style.display === 'none') {
            makeVisible(characterSidebarElement);
        } else {
            makeInvisible();
        }
    };

    const onClick_bgm = () => {
        if (bgmSidebarElement.current.style.display === 'none') {
            makeVisible(bgmSidebarElement);
        } else {
            makeInvisible();
        }
    };

    const onClick_sound = () => {
        if (soundSidebarElement.current.style.display === 'none') {
            makeVisible(soundSidebarElement);
        } else {
            makeInvisible();
        }
    };

    const onClick_script = () => {
        if (SidBar_script) {
            setSidBar_script(false);
        } else {
            setSidBar_script(true);
        }
    };

    const onClick_bgm_player = () => {
        if (bgm_audio.paused) bgm_audio.play();
        else bgm_audio.pause();
    };

    const onClick_sound_player = () => {
        if (sound_audio.paused) sound_audio.play();
        else sound_audio.pause();
    };
    
    function handleEnter(event) {
        onSubmit_nextCut(event);
    }
    
    useKey("Enter", handleEnter);

    const saveCut = () => {
        const Cut = {
            background: BackgroundImg,
            characterList: CharacterList,
            script: Script,
            name: Name,
            bgm: BgmFile,
            sound: SoundFile,
        };
        setBgmFile({
            name: "",
            music: "",
        });
        setSoundFile({
            name: "",
            music: "",
        });

        setCutList((oldArray) => [
            ...oldArray.slice(0, CutNumber),
            Cut,
            ...oldArray.slice(CutNumber + 1, 31),
        ]);
        if (CutList.length === CutNumber) {
            setEmptyCutList((oldArray) => [
                ...oldArray.slice(0, EmptyCutList.length - 1),
            ]);
        }
    };

    const displayCut = (index) => {
        setBackgroundImg(CutList[index].background);
        setCharacterList(CutList[index].characterList);
        setScript(CutList[index].script);
        setName(CutList[index].name);
        setBgmFile(CutList[index].bgm);
        setSoundFile(CutList[index].sound);
        if (CutList[index].bgm.music) {
            bgm_audio.src = CutList[index].bgm.music;
            bgm_audio.play();
        } else {
            bgm_audio.pause();
        }
        if (CutList[index].sound.music) {
            sound_audio.src = CutList[index].sound.music;
            sound_audio.play();
        } else {
            sound_audio.pause();
        }
    };

    const onRemove_character = (index) => {
        setCharacterList((oldArray) => [
            ...oldArray.slice(0, index),
            ...oldArray.slice(index + 1, 4),
        ]);
    };

    const onSubmit_nextCut = (event) => {
        event.preventDefault();
        if (CutNumber > 29) {
            message.error("더이상 Cut을 생성할 수 없습니다.");
            return;
        } else if (CutNumber === 24) {
            message.warning("생성 가능한 Cut이 5개 남았습니다.");
        }

        saveCut();

        if (CutNumber < CutList.length - 1) {
            displayCut(CutNumber + 1);
        } else {
            setScript("");
        }
        setCutNumber((oldNumber) => oldNumber + 1);
    };

    const onSubmit_saveScene = (event) => {
        event.preventDefault();
        console.log(CutList.length);
        if (CutList.length < 2) {
            message.error("최소 3개의 컷을 생성해주세요.");
            return;
        }
        const submitCut = {
            background: BackgroundImg,
            characterList: CharacterList,
            script: Script,
            name: Name,
            bgm: BgmFile,
            sound: SoundFile,
        };
        
        const submitCutList = [
            ...CutList.slice(0, CutNumber),
            submitCut,
            ...CutList.slice(CutNumber + 1, 31),
        ];

        if (window.confirm("게임 제작을 완료하시겠습니까?")) {
            const variable = {
                gameId: gameId,
                writer: userId.userData._id,
                nextList: [],
                cutList: submitCutList,
                isFirst: sceneInfo ? 0 : 1,
                depth: sceneInfo ? sceneInfo.depth + 1 : 0,
                sceneOption: SceneOption,
                prevSceneId: sceneInfo ? sceneInfo.prev_scene_id : 0,
            };
            Axios.post("/api/scene/save", variable).then((response) => {
                if (response.data.success) {
                    message
                        .loading("게임 업로드 중..", 1.5)
                        .then(() =>
                            message.success("게임 제작이 완료되었습니다.", 1.5)
                        );
                    setTimeout(() => {
                        if (sceneInfo) {
                            props.history.push(
                                `/gameplay/${gameId}/${response.data.scene._id}`
                            );
                        } else {
                            props.history.push(
                                `/game/${gameId}`
                            );
                        }
                    }, 1000);
                } else {
                    message.error("DB에 문제가 있습니다.");
                }
            });
        } else {
            message.error("제출 취소요");
        }
    };

    const padding = 0.1;
    const minSize = 300;
  
    const [ratio, setRatio] = useState(0.5);
    const [windowWidth, setwindowWidth] = useState(window.innerWidth);
    const [windowHeight, setwindowHeight] = useState(window.innerHeight);  

    useEffect(() => {
        function handleResize() {
        setwindowWidth(window.innerWidth);
        setwindowHeight(window.innerHeight);
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
    
    return (
        <div>
            {/* <LoadingPage />   */}
            <div>
                <div
                    className="backgroundImg_container"
                    style={newScreenSize}
                >
                    {BackgroundImg ? (
                        <img
                            className="backgroundImg"
                            src={`${BackgroundImg}`}
                            alt="img"
                        />
                    ) : (
                        <div></div>
                    )}
                    <CharacterBlock
                        characterList={CharacterList}
                        onRemove_character={onRemove_character}
                    />
                    {SidBar_script && (
                            <div className="sceneMake__text_container">
                                <input onChange={onNameChange} value={Name} className="sceneMake__name_block"/>
                                <hr className="sceneMake__text_line"></hr>
                                <textarea
                                    onChange={onScriptChange}
                                    value={Script}
                                    className="sceneMake__text_block"
                                />
                            </div>
                        )}
                </div>
            </div>
            <SceneBox
                CutList={CutList}
                CutNumber={CutNumber}
                displayCut={displayCut} 
                setCutNumber={setCutNumber}
                Hover={Hover}
                setHover={setHover} 
                EmptyCutList={EmptyCutList}
                saveCut={saveCut}
            />
            <div className="sceneMake__btn_container">
                {CutNumber < 29 && (
                    <Button type="primary" onClick={onSubmit_nextCut}>
                        Next(Cut)
                    </Button>
                )}
                <Button type="primary" onClick={onSubmit_saveScene}>
                    Submit
                </Button>
            </div>
            <div className="scenemake__sideBar_container">
                <div className="scenemake__toggleBar">
                    <div ref={backgroundSidebarElement}>
                        <BackgroundSideBar
                            gameId={gameId}
                            setBackgroundImg={setBackgroundImg}
                        />
                    </div>
                    <div ref={characterSidebarElement} style={{display:'none'}}>
                        <CharacterSideBar
                            gameId={gameId}
                            CharacterList={CharacterList}
                            setCharacterList={setCharacterList}
                        />
                    </div>
                    <div ref={bgmSidebarElement} style={{display:'none'}}>
                        <BgmSideBar
                            bgm_audio={bgm_audio}
                            gameId={gameId}
                            setBgmFile={setBgmFile}
                        />
                    </div>
                    <div ref={soundSidebarElement} style={{display:'none'}}>
                        <SoundSideBar
                            sound_audio={sound_audio}
                            gameId={gameId}
                            setSoundFile={setSoundFile}
                        />
                    </div>
                </div>
                
                <div className="scenemake__toggleButton_container">
                    <div
                        className="scenemake__btn_sidebar"
                        onClick={onClick_background}
                    >back</div>
                    <div
                        className="scenemake__btn_sidebar"
                        onClick={onClick_character}
                    >char</div>
                    <div
                        className="scenemake__btn_sidebar"
                        onClick={onClick_script}
                    >script</div>
                    <div className="scenemake__btn_sidebar" onClick={onClick_bgm}>
                        bgm
                    </div>
                    <div className="scenemake__btn_sidebar" onClick={onClick_sound}>
                        sound
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SceneMakePage;
