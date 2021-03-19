import React, { useEffect, useRef, useState } from "react";
import BackgroundSideBar from "./SideBar/BackgroundSideBar";
import CharacterSideBar from "./SideBar/CharacterSideBar";
import BgmSideBar from "./SideBar/BgmSideBar";
import SoundSideBar from "./SideBar/SoundSideBar";
import { useSelector } from "react-redux";
import { Input, message, Button } from "antd";
import Axios from "axios";
import { useLocation } from "react-router";
import SceneMakeModal from './SceneMakeModal';
import UploadModal from './UploadModal';

import "./SceneMakePage.css";

const { TextArea } = Input;


var bgm_audio = new Audio();
var sound_audio = new Audio();

function SceneMakePage(props) {

    //modal
    const [makeModalState, setMakeModalState] = useState(0);
    const [reload, setReload] = useState(1);
    const [uploadModalState, setUploadModalState] = useState(false);

    //modal end
    const location = useLocation();
    const sceneInfo = location.state;

    const gameId = props.match.params.gameId;
    const userId = useSelector((state) => state.user);
    const [SidBar_script, setSidBar_script] = useState(false);
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
        console.log(123456, SceneOption)
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
        backgroundSidebarElement.current.style.display = 'none'
        characterSidebarElement.current.style.display = 'none'
        bgmSidebarElement.current.style.display = 'none'
        soundSidebarElement.current.style.display = 'none'
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
            ...oldArray.slice(CutNumber + 1, 30),
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

    const onClick_GotoCut = (index) => {
        if (CutNumber > 29) {
            displayCut(index);
            setCutNumber(index);
            return;
        }
        if (CutNumber !== index) {
            saveCut();
            displayCut(index);
            setCutNumber(index);
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

    const onSubmit_first = () => {
        setUploadModalState(true)
    }

    const onSubmit_saveScene = (event) => {
        // event.preventDefault();

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
                        props.history.push(
                            `/gameplay/${gameId}/${response.data.scene._id}`
                        );
                    }, 1000);
                } else {
                    message.error("DB에 문제가 있습니다.");
                }
            });
        } else {
            message.error("제출 취소요");
        }
    };

    const onClick_isHover = () => {
        setHover(!Hover);
    }

    const display_SceneBox = CutList.map((Cut, index) => {
        if (CutNumber === index) {
            return (
                (<div className="scene__CurrentSceneBox" key={`${index}`}></div>)
            );
        } else {
            if (Hover) {
                return (
                    <div
                        className="scene__SceneBox"
                        key={`${index}`}
                        onMouseOver={() => onClick_GotoCut(index)}//?
                    ></div>
                )
            } else {
                return (
                    <div
                        className="scene__SceneBox"
                        key={`${index}`}
                        onClick={() => onClick_GotoCut(index)}
                    ></div>
                )
            }
        }
    });

    const display_EmptyBox = EmptyCutList.map((EmptyCut, index) => {
        if (CutNumber - CutList.length === index) {
            return (
                <div className="scene__CurrentSceneBox" key={`${index}`}></div>
            );
        } else {
            return (
                <div className="scene__EmptySceneBox" key={`${index}`}></div>
            );
        }
    });

    const display_Character = CharacterList.map((characterUrl, index) => {
        return (
            <div
                className="scene__characterBox"
                key={`${index}`}
                onClick={() => onRemove_character(index)}
            >
                <img
                    className="scene__character"
                    src={`${characterUrl}`}
                    alt="character"
                />
            </div>
        );
    });

    const [gameDetail, setGameDetail] = useState([]);
    const [sideBar, setSideBar] = useState([]);

    const variable = { gameId: gameId }
    useEffect(() => {
        Axios.post('/api/game/getgamedetail', variable)
            .then(response => {
                if (response.data.success) {
                    setGameDetail(response.data.gameDetail)
                } else {
                    alert('게임 정보를 로딩하는데 실패했습니다.')
                }
            })
    }, [reload])


    useEffect(() => {
        if (gameDetail.character) {
            const reload_Sidebar = (< div className="scenemake__toggleBar">
                <div ref={characterSidebarElement}>
                    <CharacterSideBar
                        gameDetail={gameDetail}
                        CharacterList={CharacterList}
                        setCharacterList={setCharacterList}
                        setMakeModalState={setMakeModalState}
                        reload={reload}
                    />
                </div>
                <div ref={backgroundSidebarElement} style={{ display: 'none' }}>
                    <BackgroundSideBar
                        gameDetail={gameDetail}
                        setBackgroundImg={setBackgroundImg}
                        setMakeModalState={setMakeModalState}
                        reload={reload}
                    />
                </div>
                <div ref={bgmSidebarElement} style={{ display: 'none' }}>
                    <BgmSideBar
                        gameDetail={gameDetail}
                        bgm_audio={bgm_audio}
                        setBgmFile={setBgmFile}
                        setMakeModalState={setMakeModalState}
                        reload={reload}
                    />
                </div>
                <div ref={soundSidebarElement} style={{ display: 'none' }}>
                    <SoundSideBar
                        gameDetail={gameDetail}
                        sound_audio={sound_audio}
                        setSoundFile={setSoundFile}
                        setMakeModalState={setMakeModalState}
                        reload={reload}
                    />
                </div>
            </div>)
            setSideBar(reload_Sidebar)
        }
    }, [gameDetail])

    return (
        <div className="scenemake__container">
            {/* //?main Screen */}
            <div className="scenemake__main">
                <div className="scene__SceneBox_container">
                    <div onClick={onClick_isHover} style={{ cursor: "pointer" }}>
                        mode : {Hover ? "Hover" : " Click "}
                    </div>
                    {display_SceneBox}
                    {display_EmptyBox}
                    <div style={{ width: "20px" }}>{CutNumber}</div>
                    {/* {CutList.length} */}
                </div>
                {BgmFile ? (
                    <div
                        className="scene__SoundBox_container"
                        onClick={onClick_bgm_player}
                    >
                        {BgmFile.name}
                    </div>
                ) : (
                    <div></div>
                )}
                {SoundFile ? (
                    <div
                        className="scene__SoundBox_container"
                        onClick={onClick_sound_player}
                    >
                        {SoundFile.name}
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="scenemake__main_img">
                    {BackgroundImg ? (
                        <img
                            className="scenemake__background"
                            src={`${BackgroundImg}`}
                            alt="img"
                        />
                    ) : (
                        <div></div>
                    )}
                    <div className="scenemake__character_container">
                        {display_Character}
                    </div>
                    {SidBar_script && (
                        <div className="scenemake__main_script">
                            <Input onChange={onNameChange} value={Name} />
                            <TextArea
                                onChange={onScriptChange}
                                value={Script}
                            />
                        </div>
                    )}
                </div>
                <div className="scenemake__btn_container">
                    {CutNumber < 29 && (
                        <Button type="primary" onClick={onSubmit_nextCut}>
                            Next(Cut)
                        </Button>
                    )}
                    {SceneOption == 0 ?
                        <Button type="primary" onClick={onSubmit_first}>
                            Submit First
                        </Button>
                        : <Button type="primary" onClick={onSubmit_saveScene}>
                            Submit
                        </Button>
                    }

                    <UploadModal
                        gameId={gameId}
                        visible={uploadModalState}
                        setUploadModalState={setUploadModalState}
                        onSubmit_saveScene={onSubmit_saveScene}
                    />
                    {/* <ModalSubmit/> */}
                </div>
            </div>
            {sideBar !== 0 && sideBar}
            <div className="scenemake__toggleButton_container">
                <div
                    className="scenemake__btn_sidebar"
                    onClick={onClick_character}
                >char</div>
                <div
                    className="scenemake__btn_sidebar"
                    onClick={onClick_background}
                >back</div>
                <div className="scenemake__btn_sidebar" onClick={onClick_bgm}>
                    bgm
                </div>
                <div className="scenemake__btn_sidebar" onClick={onClick_sound}>
                    sound
                </div>
                <div
                    className="scenemake__btn_sidebar"
                    onClick={onClick_script}
                >script</div>
            </div>
            {
                makeModalState !== 0 && <SceneMakeModal
                    gameId={gameId}
                    visible={Boolean(makeModalState)}
                    setTag={setMakeModalState}
                    tag={makeModalState}
                    setReload={setReload}
                />
            }
        </div >
    );
}

export default SceneMakePage;
