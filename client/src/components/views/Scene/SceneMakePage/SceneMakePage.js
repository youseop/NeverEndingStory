import React, { useEffect, useRef, useState } from "react";
import BackgroundSideBar from "./SideBar/BackgroundSideBar";
import CharacterSideBar from "./SideBar/CharacterSideBar";
import BgmSideBar from "./SideBar/BgmSideBar";
import SoundSideBar from "./SideBar/SoundSideBar";
import { useSelector } from "react-redux";
import { Input, message, Button, Switch } from "antd";
import Axios from "axios";
import { useLocation } from "react-router";
import SceneMakeModal from './SceneMakeModal';
import UploadModal from './UploadModal';
import useKey from "../../../functions/useKey";
import CharacterBlock from "../../GamePlayPage/CharacterBlock";
import { useDispatch } from "react-redux";
import LoadingPage from "../../GamePlayPage/LoadingPage";
import { gameLoadingPage } from "../../../../_actions/gamePlay_actions";
import { navbarControl } from "../../../../_actions/controlPage_actions";
import "./GamePlusScene.css";
import SceneBox from "./SceneBox/SceneBox";


var bgm_audio = new Audio();
var sound_audio = new Audio();

function SceneMakePage(props) {

    //modal
    const [makeModalState, setMakeModalState] = useState(0);
    const [reload, setReload] = useState(1);
    const [uploadModalState, setUploadModalState] = useState(false);

    //modal end
    const dispatch = useDispatch();
    // dispatch(navbarControl(false));
    const location = useLocation();

    const sceneInfo = location.state;
    const gameId = props.match.params.gameId;
    const userId = useSelector((state) => state.user);

    const [IsLoading, setIsLoading] = useState(false);
    const [SidBar_script, setSidBar_script] = useState(true);

    const [CharacterList, setCharacterList] = useState([]);
    const [BackgroundImg, setBackgroundImg] = useState("");
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
        if (sceneInfo) {
            const variable = { sceneId: location.state.prev_scene_id };
            Axios.post("/api/scene/scenedetail", variable)
                .then((response) => {
                    if (response.data.success) {
                        const lastCut = response.data.lastCut;
                        setCharacterList(lastCut.characterList);
                        setBackgroundImg(lastCut.background);
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
    }, [])

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

    const characterSidebarElement = useRef();
    const backgroundSidebarElement = useRef();
    const bgmSidebarElement = useRef();
    const soundSidebarElement = useRef();

    const makeVisible = (element) => {
        makeInvisible()
        element.current.style.display = 'block'
    }

    const makeInvisible = () => {
        characterSidebarElement.current.style.display = 'none'
        backgroundSidebarElement.current.style.display = 'none'
        bgmSidebarElement.current.style.display = 'none'
        soundSidebarElement.current.style.display = 'none'
    }

    const onClick_character = () => {
        if (characterSidebarElement.current.style.display === 'none') {
            makeVisible(characterSidebarElement);
        } else {
            makeInvisible();
        }
    };

    const onClick_background = () => {
        if (backgroundSidebarElement.current.style.display === 'none') {
            makeVisible(backgroundSidebarElement);
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
            characterList: CharacterList,
            background: BackgroundImg,
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
        setCharacterList(CutList[index].characterList);
        setBackgroundImg(CutList[index].background);
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

    const onRemove_cut = () => {
        if (CutList.length-1 <= CutNumber){
            message.info('마지막 컷 입니다.');
            return;
        }
        message.success(`${CutNumber+1}번째 컷이 삭제되었습니다.`);
        setCutList((oldArray) => [
            ...oldArray.slice(0, CutNumber),
            ...oldArray.slice(CutNumber + 1, 31),
        ]);
        setEmptyCutList((oldArray) => [
            0,...oldArray
        ]);
        displayCut(CutNumber + 1);
    }

    const onSubmit_first = () => {
        setUploadModalState(true)
    }

    const onSubmit_saveScene = (event) => {
        // event.preventDefault();
        console.log(CutList.length);
        if (CutList.length < 2) {
            message.error("최소 3개의 컷을 생성해주세요.");
            return;
        }
        const submitCut = {
            characterList: CharacterList,
            background: BackgroundImg,
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
    if (windowWidth * ratio > windowHeight) {
        newScreenSize = {
            width: `${windowHeight * (1 - 2 * padding) / ratio}px`,
            height: `${windowHeight * (1 - 2 * padding)}px`,
            minWidth: `${minSize / ratio}px`,
            minHeight: `${minSize}px`
        }
    } else {
        newScreenSize = {
            width: `${windowWidth * (1 - 2 * padding)}px`,
            height: `${windowWidth * (1 - 2 * padding) * ratio}px`,
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
                    <CharacterBlock
                        characterList={CharacterList}
                        onRemove_character={onRemove_character}
                    />
                    {SidBar_script && (
                        <div className="sceneMake__text_container">
                            <input onChange={onNameChange} value={Name} className="sceneMake__name_block" />
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
                <Button type="primary" onClick={onRemove_cut}>
                    Remove Cut
                </Button>
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
            </div>
            <div className="scenemake__sideBar_container">
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
            {
                makeModalState !== 0 && <SceneMakeModal
                    gameId={gameId}
                    visible={Boolean(makeModalState)}
                    setTag={setMakeModalState}
                    tag={makeModalState}
                    setReload={setReload}
                />
            }
        </div>
    );
}

export default SceneMakePage;
