import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import BackgroundSideBar from "./SideBar/BackgroundSideBar";
import CharacterSideBar from "./SideBar/CharacterSideBar";
import BgmSideBar from "./SideBar/BgmSideBar";
import SoundSideBar from "./SideBar/SoundSideBar";
import { useSelector } from "react-redux";
import { message } from "antd";
import Axios from "axios";
import { useLocation } from "react-router";
import EssetModal from './EssetModal';
import UploadModal from './UploadModal';
import EndingModal from './EndingModal';
import useKey from "../../../functions/useKey";
import CharacterBlock from "../../GamePlayPage/CharacterBlock";
import { useDispatch } from "react-redux";
import LoadingPage from "../../GamePlayPage/LoadingPage";
import { gameLoadingPage } from "../../../../_actions/gamePlay_actions";
import { navbarControl, footerControl } from "../../../../_actions/controlPage_actions";
import CharacterModal from "../../../functions/CharacterModal/CharacterModal";
import SceneBox from "./SceneBox/SceneBox";
import Clock from "react-live-clock"
import axios from "axios";
import { SVG } from "../../../svg/icon";
import { useHistory } from "react-router-dom"
import { socket } from "../../../App";
import { PlayCircleOutlined, PauseCircleOutlined, StopOutlined } from '@ant-design/icons';
import { detachCharacter, popCharacter, setCharacterList } from "../../../../_actions/characterSelected_actions";
import "./SceneMakePage.css";
import "./SceneMakeMobilePage.css";

import { LOCAL_HOST } from "../../../Config";
import { TextBlock } from "../../GamePlayPage/TextBlock";
import { MS_PER_HR } from "../../../App"
import moment from "moment";
import SceneEndingPage from "../SceneEndingPage/SceneEndingPage";
import VolumeController from "./VolumeController"

let bgm_audio = new Audio();
bgm_audio.loop = true;
let sound_audio = new Audio();
const config = require('../../../../config/key')
const SceneMakePage = (props) => {
    // window.addEventListener('beforeunload', (event) => {
    //     // 표준에 따라 기본 동작 방지
    //     event.preventDefault();
    //     // Chrome에서는 returnValue 설정이 필요함
    //     event.returnValue = '';
    // });

    const isMobile = useRef(false);
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
        isMobile.current = true;
    }

    useLayoutEffect(() => {
        const rootDom = document.getElementById("root");
        const footer = rootDom.getElementsByClassName("footer-container");
        if (footer[0])
            footer[0].remove();

        const nav = document.getElementById("menu");
        nav.className += " isMake"
    }, []);

    //! mobile focus event
    useEffect(() => {
        if (isMobile.current) {
            const focusMobileText = (event) => {
                if (event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT") {
                    if (document.body.style.zoom !== "180%")
                        document.body.style.zoom = "180%"
                } else {
                    if (document.body.style.zoom !== "100%")
                        document.body.style.zoom = "100%"
                }
            }
            document.addEventListener("mousedown", focusMobileText);
            return _ => {
                document.removeEventListener("mousedown", focusMobileText);
            }
        }
    }, []);

    const TEXT_MAX_LENGTH = 50;
    const LIMIT_HR = 1;
    const LIMIT_TO_MS = (LIMIT_HR * 60) * 60 * 1000
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const { gameId, sceneId } = location.state
    let exp;
    // const {gameId,sceneId} = location.state ;
    if (location.state === undefined) {
        window.history.back();
        // return <div></div>;
    }
    message.config({ maxCount: 2 })

    const user = useSelector((state) => state.user);
    const CharacterList = useSelector((state) => state.character.CharacterList);

    const padding = 0.1;
    const minSize = 300;
    const ratio = 1080 / 1920;

    const [windowWidth, setwindowWidth] = useState(window.innerWidth);
    const [windowHeight, setwindowHeight] = useState(window.innerHeight);
    const [newScreenSize, setNewScreenSize] = useState({});

    //modal
    const [essetModalState, setEssetModalState] = useState(0);
    const [uploadModalState, setUploadModalState] = useState(false);
    const [endingModalState, setEndingModalState] = useState(false);
    const [reload, setReload] = useState(0);

    const [SidBar_script, setSidBar_script] = useState(true);

    const [BackgroundImg, setBackgroundImg] = useState(`${config.STORAGE}/uploads/defaultBackground.png`);
    const [Script, setScript] = useState("");
    const [Name, setName] = useState("");
    const [writer, setWriter] = useState(null);
    const [BgmFile, setBgmFile] = useState({
        name: "",
        music: "",
    });
    const [SoundFile, setSoundFile] = useState({
        name: "",
        music: "",
    });

    const isFirstScene = useRef(false);
    const [expTime, setExpTime] = useState(0)
    const [CutNumber, setCutNumber] = useState(0);
    const [Hover, setHover] = useState(false);

    const [CutList, setCutList] = useState([]);
    const [EmptyCutList, setEmptyCutList] = useState(
        Array.from({ length: 30 }, () => 0)
    );

    const useConstructor = (cb) => {
        const [isInited, setInit] = useState(false);
        if (isInited) return;
        cb();
        setInit(true);
    }

    useConstructor(() => {
        dispatch(setCharacterList({ CharacterList: [] }));
    });

    let scene;
    useEffect(() => {
        dispatch(footerControl(false));
    }, [])

    useEffect(() => {
        if (user.userData) {
            socket.emit("leave room", { room: user.userData?._id?.toString() });
            socket.emit("room", { room: user.userData?._id?.toString() });
        }
        socket.off("timeout_making")
        socket.on("timeout_making", data => {
            props.history.replace("/")
        })

    }, [user])

    //! scene save할 때 필요한 정보 갖고오기
    const creator = useRef(null);
    const theme = useRef(null);
    useEffect(() => {
        (async () => {
            const res = await axios.get(`/api/game/getSceneInfo/${sceneId}`)

            const validation = await axios.post(`/api/game/scene/validate`, { sceneId, gameId, isMaking: true })
            if (res.data.success && validation.data.success) { scene = res.data.scene; creator.current = res.data.creator }
            else {
                props.history.replace("/");
                return;
            }
            // 임시저장한 녀석
            theme.current = scene.theme;
            setWriter(scene.writer);
            const tmpExpTime = new Date(scene.createdAt).getTime() + LIMIT_TO_MS
            setExpTime(tmpExpTime)
            if (scene.cutList.length) {

                if (scene.isFirst) {
                    isFirstScene.current = true;
                }

                // 임시저장된 녀석 불러오기
                setEmptyCutList(Array.from({ length: 30 - scene.cutList.length }, () => 0))
                setCutList(scene.cutList);
                const tmpFirstCut = scene.cutList[0]
                dispatch(setCharacterList({ CharacterList: tmpFirstCut.characterList }));
                setBackgroundImg(tmpFirstCut.background)
                setName(tmpFirstCut.name);
                setScript(tmpFirstCut.script);
                setCutNumber(scene.cutList.length - 1);
                dispatch(gameLoadingPage(0));
                dispatch(gameLoadingPage(1));
            }
            // 껍데기
            else {
                if (!scene.isFirst) {
                    const variable = { sceneId: scene.prevSceneId };
                    Axios.post("/api/scene/scenedetail", variable)
                        .then((response) => {
                            //! 이전 씬의 마지막 컷 설정 유지
                            if (response.data.success) {
                                const lastCut = response.data.lastCut;
                                dispatch(setCharacterList({ CharacterList: lastCut.characterList }));
                                setBackgroundImg(lastCut.background);
                                setName(lastCut.name);
                                dispatch(gameLoadingPage(0));
                                dispatch(gameLoadingPage(1));
                            } else {
                                message.error("이전 Scene의 정보를 불러오는데 실패했습니다.")
                            }
                        })
                }
                else {
                    isFirstScene.current = true;
                }
            }
            setReload(reload => reload + 1)
        })();
    }, [])

    const onScriptChange = (event) => {
        if (event.currentTarget.value.length === (TEXT_MAX_LENGTH + 1)) {
            message.error({
                content: '글자 수 제한을 초과하였습니다.',
            });
        }
        else {
            if (event.currentTarget.value[event.currentTarget.value.length - 1] !== '\n') {
                setScript(event.currentTarget.value);
            }
        }
    }

    const onNameChange = (event) => {
        setName(event.currentTarget.value);
    };
    const characterSidebarElement = useRef();
    const backgroundSidebarElement = useRef();
    const bgmSidebarElement = useRef();
    const soundSidebarElement = useRef();
    const scriptElement = useRef();
    const nameElement = useRef();

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
    const sideTabIndex = useRef(1);
    const onClick_character = () => {
        if (characterSidebarElement.current.style.display === 'none') {
            makeVisible(characterSidebarElement);
            setReload(reload => reload + 1);
            sideTabIndex.current = 1;
        }
    };

    const onClick_background = () => {
        if (backgroundSidebarElement.current.style.display === 'none') {
            makeVisible(backgroundSidebarElement);
            setReload(reload => reload + 1);
            sideTabIndex.current = 2;
        }
    };


    const onClick_bgm = () => {
        if (bgmSidebarElement.current.style.display === 'none') {
            makeVisible(bgmSidebarElement);
            setReload(reload => reload + 1);
            sideTabIndex.current = 3;
        }
    };

    const onClick_sound = () => {
        if (soundSidebarElement.current.style.display === 'none') {
            makeVisible(soundSidebarElement);
            setReload(reload => reload + 1);
            sideTabIndex.current = 4;
        }
    };

    const onClick_script = () => {
        if (SidBar_script) {
            setSidBar_script(false);
        } else {
            setSidBar_script(true);
        }
    };

    const onClick_bgm_box = () => {
        if (bgm_audio.src && bgm_audio.paused) bgm_audio.play();
        else bgm_audio.pause();
        setReload(reload => reload + 1)
        onClick_bgm();
    };

    useEffect(() => {
        bgm_audio.addEventListener('ended', () => setReload(reload => reload + 1));
        sound_audio.addEventListener('ended', () => setReload(reload => reload + 1));
        return () => {
            bgm_audio.addEventListener('ended', () => setReload(reload => reload + 1));
            sound_audio.removeEventListener('ended', () => setReload(reload => reload + 1));
        };
    }, []);

    const onClick_sound_box = () => {
        if (sound_audio.src && sound_audio.paused) sound_audio.play();
        else sound_audio.pause();
        setReload(reload => reload + 1)
        onClick_sound();
    };

    function handleEnter(event) {
        if (nameElement.current === document.activeElement)
            scriptElement.current.focus();
        else if (scriptElement.current === document.activeElement)
            onSubmit_nextCut(event);
        else
            scriptElement.current.focus();
    }

    function handleTab(event) {
        if (nameElement.current === document.activeElement)
            scriptElement.current.focus();
        else if (scriptElement.current === document.activeElement)
            nameElement.current.focus();
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
        dispatch(setCharacterList({ CharacterList: CutList[index]?.characterList }));
        setBackgroundImg(CutList[index]?.background);
        setScript(CutList[index]?.script);
        setName(CutList[index]?.name);
        setBgmFile(CutList[index]?.bgm);
        setSoundFile(CutList[index]?.sound);
        if (CutList[index]?.bgm.music) {
            let cutIdx = bgm_audio.src.lastIndexOf("/") + 1;
            if (bgm_audio.src.substr(cutIdx) !== CutList[index].bgm.music.substr(cutIdx)) {
                bgm_audio.src = CutList[index]?.bgm.music;
                bgm_audio.play();
            }
        } else {
            bgm_audio.pause();
        }
        if (CutList[index]?.sound.music) {
            sound_audio.src = CutList[index]?.sound.music;
            sound_audio.play();
        } else {
            sound_audio.pause();
        }
    };

    const onRemove_character = (index) => {
        dispatch(popCharacter({
            oldArray: CharacterList,
            index
        }))
    };

    const onClick_plusBtn = (event) => {
        event.preventDefault();
        if (CutList.length + 1 === 24) {
            message.warning("생성 가능한 Cut이 5개 남았습니다.");
        }

        saveCut();

        setScript("");
        if (CutNumber === CutList.length)
            setCutNumber(CutList.length + 1);
        else
            setCutNumber(CutList.length);
        if (!isMobile.current)
            scriptElement.current.focus()
    };


    const onSubmit_nextCut = (event) => {
        event.preventDefault();
        if (CutNumber >= 29) {
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
        if (!isMobile.current)
            scriptElement.current.focus()
    };

    const onRemove_cut = () => {
        if (CutList.length <= 1 && CutNumber < 1) {
            // setCutList([]);
            // setEmptyCutList((oldArray) => [
            //     0, ...oldArray
            // ]);
            // displayCut(0);
            // setCutNumber(0);
            message.info('첫번째 컷 입니다.');
            return;
        } else if (CutList.length - 1 <= CutNumber) {
            if (CutList[CutNumber]) {
                setCutList((oldArray) => [
                    ...oldArray.slice(0, CutNumber)
                ]);
                setEmptyCutList((oldArray) => [
                    0, ...oldArray
                ]);
            }
            displayCut(CutNumber - 1);
            setCutNumber(CutNumber - 1);
            return;
        }
        message.success(`${CutNumber + 1}번째 컷이 삭제되었습니다.`);
        setCutList((oldArray) => [
            ...oldArray.slice(0, CutNumber),
            ...oldArray.slice(CutNumber + 1, 31),
        ]);
        setEmptyCutList((oldArray) => [
            0, ...oldArray
        ]);
        displayCut(CutNumber + 1);
    }

    const setTree = () => {
        Axios.post("/api/treedata/").then((response) => {
            console.log('treedata successfully added');
        });
    }

    const onSubmit_first = () => {
        setUploadModalState(true)
    }

    const isEnding = useRef(false);
    const onSubmit = () => {
        setEndingModalState(true)
    }

    const onSubmit_saveScene = async (event, isTmp = 0) => {
        if (CutList.length < 1 || (CutList.length === 1 && CutList[CutNumber])) {
            message.error("최소 2개의 컷을 생성해주세요.");
            return;
        }

        bgm_audio.pause();
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
        if (isTmp || isEnding || window.confirm("스토리 제작을 완료하시겠습니까?")) {

            const variable = {
                cutList: submitCutList,
                isEnding: isEnding.current,
                gameId,
                sceneId,
                isTmp,
            };

            const response = await Axios.post(`/api/scene/save`, variable)

            if (response.data.success) {
                setTree();
                dispatch(detachCharacter());
                message
                    .loading((isTmp ? "임시 저장 중..." : "게임 업로드 중.."), 1.0)
                    .then(() => {
                        if (!isTmp) {
                            message.success("스토리 제작이 완료되었습니다.", 1.0)
                        }
                        else {
                            message.success("임시 저장 완료.")
                        }
                    }
                    ).then(() => {
                        if (!isTmp && isFirstScene.current) {
                            history.replace(
                                `/game/${gameId}`
                            );

                        } else if (!isTmp) {
                            socket.emit("final_submit", {
                                prevSceneId: response.data.scene.prevSceneId,
                                sceneId: response.data.scene._id,
                                title: response.data.scene.title,
                                userId: user.userData._id?.toString(),
                            })
                            history.replace({
                                pathname: `/gameplay`,
                                state: {
                                    sceneId: response.data.scene._id,
                                    gameId: gameId,
                                }
                            })
                        }
                    })
            } else if (response.data.msg === 'expired') {
                message.error("제작 유효기간이 만료되었습니다..", 1.0);
                props.history.replace({
                    pathname: `/gameplay`,
                    state: {
                        sceneId: response.data.prevSceneId,
                        gameId: gameId,
                    }
                })
                return;
            }
            else {
                message.error("DB에 문제가 있습니다.");
            }

        } else {
            message.error("제출 취소");
        }
    };
    const onDeleteScene = () => {
        if (window.confirm("스토리 제작을 취소하시겠습니까?")) {
            Axios.delete('/api/scene', {
                data: {
                    gameId: gameId,
                    sceneId: sceneId,
                    isFirst: isFirstScene.current,
                    userId: user.userData._id
                }
            })
                .then(response => {
                    if (response.data.success) {
                        //! 다 삭제되면 emptyNum 올려주기
                        if (isFirstScene.current == false) {
                            socket.emit("empty_num_increase",
                                {
                                    scene_id: response.data.prevSceneId,
                                    user_id: user.userData._id
                                })
                            //! 돌아가야할 곳 : game detail 로 가자
                            props.history.push(`/game/${gameId}`)
                        }
                        else {
                            //! 들어가야할 곳 : 홈화면
                            props.history.push(`/`)
                        }
                    }
                })

        }
    }
    const onTmpSave = (event) => {
        onSubmit_saveScene(event, 1);
    }

    const onEssetModal = () => {
        setEssetModalState(sideTabIndex.current);
    }

    const onCompleteModal = () => {
        if (!reload) //동시성 반창고
            return;
        if (isFirstScene.current)
            setUploadModalState(true)
        else
            setEndingModalState(true)
    }


    const [gameDetail, setGameDetail] = useState([]);
    const [sideBar, setSideBar] = useState([]);

    useEffect(() => {
        Axios.post('/api/game/detail', { gameId: gameId })
            .then(response => {
                if (response.data.success) {
                    setGameDetail(response.data.gameDetail)
                } else {
                    alert('스토리 정보를 로딩하는데 실패했습니다.')
                }
            })
    }, [reload, gameId])

    let isWriter = creator.current?.toString() === user.userData?._id?.toString();

    useEffect(() => {
        if (gameDetail.character) {
            const reload_Sidebar = (< div className="sideBar">
                <div ref={characterSidebarElement}>
                    <div className="modal">

                        <CharacterModal
                            reload={reload} //update용
                            setName={setName}
                            GameCharacterList={gameDetail.character}
                        />
                        <CharacterSideBar
                            gameDetail={gameDetail}
                            setName={setName}
                            onEssetModal={onEssetModal}
                            isFirstScene={isFirstScene}
                            isWriter={isWriter}
                        />
                    </div>
                </div>
                <div ref={backgroundSidebarElement} style={{ display: 'none' }}>
                    <BackgroundSideBar
                        gameDetail={gameDetail}
                        setBackgroundImg={setBackgroundImg}
                        onEssetModal={onEssetModal}
                        isFirstScene={isFirstScene}
                        curImg={BackgroundImg}
                        setReload={setReload}
                        isWriter={isWriter}
                    />
                </div>
                <div ref={bgmSidebarElement} style={{ display: 'none' }}>
                    <BgmSideBar
                        gameDetail={gameDetail}
                        bgm_audio={bgm_audio}
                        setBgmFile={setBgmFile}
                        onEssetModal={onEssetModal}
                        isFirstScene={isFirstScene}
                        setReload={setReload}
                        isWriter={isWriter}
                    />
                </div>
                <div ref={soundSidebarElement} style={{ display: 'none' }}>
                    <SoundSideBar
                        gameDetail={gameDetail}
                        sound_audio={sound_audio}
                        setSoundFile={setSoundFile}
                        onEssetModal={onEssetModal}
                        isFirstScene={isFirstScene}
                        setReload={setReload}
                        isWriter={isWriter}
                    />
                </div>
            </div>)
            setSideBar(reload_Sidebar)
        }
    }, [gameDetail, CharacterList, reload])

    useEffect(() => {
        function handleResize() {
            setwindowWidth(window.innerWidth);
            setwindowHeight(window.innerHeight);
        }
        window.addEventListener('resize', handleResize)
        if (windowWidth * ratio > windowHeight) {
            setNewScreenSize({
                width: `${windowHeight * (1 - 2 * padding) / ratio}px`,
                height: `${windowHeight * (1 - 2 * padding)}px`,
                minWidth: `${minSize / ratio}px`,
                minHeight: `${minSize}px`
            })
        } else {
            setNewScreenSize({
                width: `${windowWidth * (1 - 2 * padding)}px`,
                height: `${windowWidth * (1 - 2 * padding) * ratio}px`,
                minWidth: `${minSize}px`,
                minHeight: `${minSize * ratio}px`
            })
        }
    }, [window.innerWidth, window.innerHeight]);

    const onLeft = () => {
        if (CutNumber !== 0) {
            saveCut();
            displayCut(CutNumber - 1);
            setCutNumber(CutNumber - 1);
        }
    }
    useEffect(() => {
        return () => {
            bgm_audio.pause();
            sound_audio.pause();
            const nav = document.getElementById("menu");
            nav.className = "menu"
        };
    }, []);

    const [bgmVolume, setBgmVolume] = useState(0.5)
    const [bgmMuted, setBgmMuted] = useState(false)
    const tempBgmVolume = useRef(0.5)

    const [soundVolume, setSoundVolume] = useState(0.5)
    const [soundMuted, setSoundMuted] = useState(false)
    const tempSoundVolume = useRef(0.5)

    if (gameDetail?._id) {
        return (
            <div className="wrapper">
                <div className="title">
                    {/* <div
                        className="title-btn"
                        onClick={() => setEssetModalState(5)}>
                        게임정보
                    </div> */}
                    <div>
                        <span>[{gameDetail?.title}]</span>
                        {/* <span>제작 유효기간: 2020.01.02 {exp}</span> */}
                        {!isFirstScene &&
                            <Clock format={`HH:mm:ss`} date={expTime} timezone={`Asia/Seoul`}></Clock>
                        }
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
                    onClick_plusBtn={onClick_plusBtn}
                    onRemove_cut={onRemove_cut}
                />

                <div className="scene">
                    <div className="scene left-arrow"
                        onClick={onLeft}>
                        <SVG src="arrow_1" width="100%" height="100%" color="#F5F5F5" />
                    </div>
                    <div
                        className="backgroundImg"
                        id="backgroundImg_container"
                        style={{ overflow: "hidden" }}
                    >

                        <img
                            className="backgroundImg"
                            // id="backgroundImg_container"
                            src={`${BackgroundImg}`}
                            alt="img"
                        />
                        <CharacterBlock
                            GameCharacterList={gameDetail.character}
                            onRemovech_aracter={onRemove_character}
                            setName={setName}
                        />
                        {SidBar_script && Script && (
                            <TextBlock
                                cut_name={Name ? Name : "이름을 입력해주세요."}
                                cut_script={Script ? Script : "대사를 입력해주세요."}
                                setIsTyping={null}
                                isTyping={null}
                                theme={theme.current}
                            />
                        )}
                        <div className="scene__sound_container">
                            {BgmFile?.name ? (
                                <div
                                    className="scene__sound_box"
                                    onClick={onClick_bgm_box}
                                >
                                    {
                                        BgmFile.name && bgm_audio.paused &&
                                        <PlayCircleOutlined
                                            className="scene__sound_icon bgm" />
                                    }
                                    {
                                        BgmFile.name && !bgm_audio.paused &&
                                        <PauseCircleOutlined
                                            className="scene__sound_icon bgm" />
                                    }
                                    <div className="scene__sound_bgm_name">{BgmFile.name}</div>
                                </div>
                            ) : (
                                <div
                                    className="scene__sound_box"
                                    onClick={onClick_bgm_box}
                                >
                                    <StopOutlined
                                        className="scene__sound_icon bgm" />
                                    <div className="scene__sound_bgm_name">BGM</div>
                                </div>
                            )}
                            {SoundFile?.name ? (
                                <div
                                    className="scene__sound_box"
                                    onClick={onClick_sound_box}
                                >
                                    {
                                        SoundFile.name && sound_audio.paused &&
                                        <PlayCircleOutlined
                                            className="scene__sound_icon sound" />
                                    }
                                    {
                                        SoundFile.name && !sound_audio.paused &&
                                        <PauseCircleOutlined
                                            className="scene__sound_icon sound" />
                                    }
                                    <div className="scene__sound_sound_name">{SoundFile.name}</div>
                                </div>
                            ) : (
                                <div
                                    className="scene__sound_box"
                                    onClick={onClick_sound_box}
                                >
                                    <StopOutlined
                                        className="scene__sound_icon sound" />
                                    <div className="scene__sound_sound_name">Sound</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="scene right-arrow"
                        onClick={onSubmit_nextCut}>
                        <SVG src="arrow_1" width="100%" height="100%" color={CutNumber < 29 ? "#F5F5F5" : "black"} />
                    </div>
                </div>
                <div className="scene__btn_top">
                    {/* {(isFirstScene.current || isWriter) &&
                        <div className="scene_btn scene_btn_red"
                            onClick={onEssetModal}>
                            에셋 추가
                        </div>
                    } */}
                    <div className="scene_btn"
                        onClick={onDeleteScene}>
                        제작 취소
                    </div>
                    <div className="scene_btn"
                        onClick={onTmpSave}>
                        임시 저장
                    </div>
                    <div className="scene_btn scene_btn_blue"
                        onClick={onCompleteModal}>
                        완료
                    </div>

                </div>
                <div className="btn_side">
                    <div
                        className={sideTabIndex.current === 1 ? "scene_side_btn light" : "scene_side_btn"}
                        onClick={onClick_character}
                    >캐릭터</div>
                    <div
                        className={sideTabIndex.current === 2 ? "scene_side_btn light" : "scene_side_btn"}
                        onClick={onClick_background}
                    >배경</div>

                    <div
                        className={sideTabIndex.current === 3 ? "scene_side_btn light" : "scene_side_btn"}
                        onClick={onClick_bgm}>
                        배경음
                        </div>
                    <div
                        className={sideTabIndex.current === 4 ? "scene_side_btn light" : "scene_side_btn"}
                        onClick={onClick_sound}>
                        효과음
                        </div>
                </div>
                {sideBar !== 0 && sideBar}
                <div
                    className="textbox_name">
                    {/* <div className="textbox__name_block_btn">
                        <SVG src="arrow_1" width="15" height="25" color="#FFFFFF" />
                    </div> */}
                </div>
                <input
                    onChange={onNameChange}
                    placeholder="이름"
                    value={Name}
                    ref={nameElement}
                    maxLength={15}
                    className="textbox_name"
                />

                <div className="textbox_bottom">
                    <div className="enter"
                        onClick={onSubmit_nextCut}>
                        Enter
                        <br />
                        {/* {CutNumber + 1}/30
                        <br /> */}
                        {Script.length}/{TEXT_MAX_LENGTH}
                    </div>
                    <textarea
                        onChange={onScriptChange}
                        value={Script}
                        placeholder="대사가 없으면 스크립트 창이 표시되지 않습니다."
                        className="textbox_script"
                        maxLength={TEXT_MAX_LENGTH}
                        ref={scriptElement}
                    />
                </div>
                <div className="options">
                    <div className="scenemake_volume">
                        <div className="scenemake_volume_text">BGM</div>
                        <VolumeController
                            audio={bgm_audio}
                            volume={bgmVolume}
                            setVolume={setBgmVolume}
                            muted={bgmMuted}
                            setMuted={setBgmMuted}
                            tempVolume={tempBgmVolume}
                        />
                    </div>
                    <div className="scenemake_volume">
                        <div className="scenemake_volume_text">SFX</div>
                        <VolumeController
                            audio={sound_audio}
                            volume={soundVolume}
                            setVolume={setSoundVolume}
                            muted={soundMuted}
                            setMuted={setSoundMuted}
                            tempVolume={tempSoundVolume}
                        />
                    </div>
                </div>

                <UploadModal
                    gameId={gameId}
                    visible={uploadModalState}
                    setUploadModalState={setUploadModalState}
                    onSubmit_saveScene={onSubmit_saveScene}
                    defaultTitle={gameDetail.title}
                    defaultDescription={gameDetail.description}
                    defaultCategory={gameDetail.category}
                />
                <EndingModal
                    isEnding={isEnding}
                    visible={endingModalState}
                    setEndingModalState={setEndingModalState}
                    onSubmit_saveScene={onSubmit_saveScene}
                />
                {
                    essetModalState !== 0 && <EssetModal
                        gameDetail={gameDetail}
                        gameId={gameId}
                        visible={Boolean(essetModalState)}
                        tag={essetModalState}
                        setTag={setEssetModalState}
                        setReload={setReload}
                    />
                }
            </div >
        )
    }
    else {
        return (
            <LoadingPage />
        )
    }
}

export default SceneMakePage;