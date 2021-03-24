import React, { useEffect, useRef, useState } from "react";
import BackgroundSideBar from "./SideBar/BackgroundSideBar";
import CharacterSideBar from "./SideBar/CharacterSideBar";
import BgmSideBar from "./SideBar/BgmSideBar";
import SoundSideBar from "./SideBar/SoundSideBar";
import { useSelector } from "react-redux";
import { message, Button } from "antd";
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
import "./SceneMakePage.css";
import SceneBox from "./SceneBox/SceneBox";
import axios from "axios";
import { useHistory } from "react-router-dom"
import { socket } from "../../../App";

let bgm_audio = new Audio();
let sound_audio = new Audio();
const SceneMakePage = (props) => {
    const history = useHistory();
    const user  = useSelector((state) => state.user);

    const padding = 0.1;
    const minSize = 300;

    const [ratio, setRatio] = useState(0.5);
    const [windowWidth, setwindowWidth] = useState(window.innerWidth);
    const [windowHeight, setwindowHeight] = useState(window.innerHeight);
    const [newScreenSize, setNewScreenSize] = useState({});

    //modal
    const [makeModalState, setMakeModalState] = useState(0);
    const [reload, setReload] = useState(1);
    const [uploadModalState, setUploadModalState] = useState(false);


    //modal end
    const dispatch = useDispatch();

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

    const gameId = props.match.params.gameId;
    const sceneId = props.match.params.sceneId;
    const [isFirstScene, setIsFirstScene] = useState(false)

    const [CutNumber, setCutNumber] = useState(0);
    const [Hover, setHover] = useState(false);

    const [CutList, setCutList] = useState([]);
    const [EmptyCutList, setEmptyCutList] = useState(
        Array.from({ length: 30 }, () => 0)
    );


    let scene;
    useEffect(() => {
        dispatch(navbarControl(false));

    }, [])


    useEffect(() => {
        socket.off("timeout_making")
        socket.on("timeout_making", data =>{
            console.log("GO HOME")
            props.history.push("/")
        })

    }, [user])

    //! scene save할 때 필요한 정보 갖고오기
    useEffect( () => {
        (async () => {
            const res = await axios.get(`/api/game/getSceneInfo/${sceneId}`)
            if (res.data.success) { scene = res.data.scene; }
            else {
                console.log("get scene ERROR");
                props.history.push("/");
            }
            // 임시저장한 녀석
            if(scene.cutList.length){

                if(scene.isFirst){
                    setIsFirstScene(true)
                }

                // 임시저장된 녀석 불러오기
                setCutList(scene.cutList);
                const tmpFirstCut = scene.cutList[0]
                setCharacterList(tmpFirstCut.characterList)
                setBackgroundImg(tmpFirstCut.background)
                setName(tmpFirstCut.name);
                setScript(tmpFirstCut.script);
                setCutNumber(scene.cutList.length-1);

                dispatch(gameLoadingPage(0));
                dispatch(gameLoadingPage(1));

            }
            // 껍데기
            else{
                if (!scene.isFirst) {
                    const variable = { sceneId: scene.prevSceneId };
                    Axios.post("/api/scene/scenedetail", variable)
                        .then((response) => {
                            //! 이전 씬의 마지막 컷 설정 유지
                            if (response.data.success) {
                                const lastCut = response.data.lastCut;
                                setCharacterList(lastCut.characterList);
                                setBackgroundImg(lastCut.background);
                                setName(lastCut.name);
                                dispatch(gameLoadingPage(0));
                                dispatch(gameLoadingPage(1));
                            } else {
                                message.error("이전 Scene의 정보를 불러오는데 실패했습니다.")
                            }
                        })
                }
                else{
                    setIsFirstScene(true)
                }
            }
        })();
    }, [])

    useEffect(() => {
        const variable = { gameId: gameId };
        Axios.post("/api/game/ratio", variable).then((response) => {
            if (response.data.success) {
                if (response.data.ratio) {
                    setRatio(parseFloat(response.data.ratio));
                } else {
                    message.info("배경화면의 비율 정보가 존재하지 않습니다. 2:1로 초기화 합니다.");
                }
            } else {
                message.error("Scene 정보가 없습니다.");
            }
        });
    }, [])

  

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
        if (CutList.length - 1 <= CutNumber) {
            message.info('마지막 컷 입니다.');
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

    const onSubmit_first = () => {
        setUploadModalState(true)
    }

    const onSubmit_saveScene = async (event, isTmp=0) => {
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
                sceneId: sceneId,
                cutList: submitCutList,
                isTmp,
            };

            const response = await Axios.post(`/api/scene/save`, variable)

            if (response.data.success) {
                message
                    .loading("게임 업로드 중..", 1.0)
                    .then(() => {
                        if (!isTmp) { 
                            message.success("게임 제작이 완료되었습니다.", 1.0)
                        }
                        else {
                            message.success("업로드 성공.")
                        }
                    }
                    ).then(() => {
                        if (!isTmp && isFirstScene) {
                            history.push(
                                `/game/${gameId}`
                            );

                        } else if ( !isTmp ) {
                            socket.emit("final_submit", {
                                prevSceneId : response.data.scene.prevSceneId, 
                                sceneId : response.data.scene._id, 
                                title: response.data.scene.title,
                                userId: user.userData._id.toString(),
                            })
                            history.push(
                                `/gameplay/${gameId}/${response.data.scene._id}`
                            );
                        }
                    })
            } else {
                message.error("DB에 문제가 있습니다.");
            }

        } else {
            message.error("제출 취소요");
        }
    };

    const onTmpSave = (event) => {
        onSubmit_saveScene(event, 1);
    }

    const [gameDetail, setGameDetail] = useState([]);
    const [sideBar, setSideBar] = useState([]);

    useEffect(() => {
        Axios.post('/api/game/getgamedetail', { gameId: gameId })
            .then(response => {
                if (response.data.success) {
                    setGameDetail(response.data.gameDetail)
                } else {
                    alert('게임 정보를 로딩하는데 실패했습니다.')
                }
            })
    }, [reload, gameId])


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

    return (
        <div className="scene__container">
            {/* <LoadingPage />   */}
            <div>
                <div
                    className="backgroundImg_container"
                    style={newScreenSize}
                >
                    {BgmFile.name ? (
                        <div
                            className="scene__SoundBox_container"
                            onClick={onClick_bgm_player}
                        >
                            {BgmFile.name}
                        </div>
                    ) : (
                        <div>BGM</div>
                    )}
                    {SoundFile.name ? (
                        <div
                            className="scene__SoundBox_container"
                            onClick={onClick_sound_player}
                        >
                            {SoundFile.name}
                        </div>
                    ) : (
                        <div>Sound</div>
                    )}
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
                <Button type="primary" onClick={onTmpSave}>
                    Temporary save
                </Button>
                <Button type="primary" onClick={onRemove_cut}>
                    Remove Cut
                </Button>
                {CutNumber < 29 && (
                    <Button type="primary" onClick={onSubmit_nextCut}>
                        Next(Cut)
                    </Button>
                )}
                {isFirstScene ?
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
