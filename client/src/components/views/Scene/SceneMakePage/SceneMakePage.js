import React, { useEffect, useState } from "react";
import BackgroundSideBar from "./SideBar/BackgroundSideBar";
import CharacterSideBar from "./SideBar/CharacterSideBar";
import BgmSideBar from "./SideBar/BgmSideBar";
import SoundSideBar from "./SideBar/SoundSideBar";
import "./SceneMakePage.css";
import { useSelector } from "react-redux";
import { Input, message, Button } from "antd";
import Axios from "axios";
const { TextArea } = Input;

var bgm_audio = new Audio();
var sound_audio = new Audio();

function SceneMakePage(props) {
    const gameId = props.match.params.gameId;
    const userId = useSelector((state) => state.user);
    const [SidBar_b, setSidBar_b] = useState(false);
    const [SidBar_c, setSidBar_c] = useState(false);
    const [SidBar_script, setSidBar_script] = useState(false);
    const [SidBar_bgm, setSidBar_bgm] = useState(false);
    const [SidBar_sound, setSidBar_sound] = useState(false);

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

    const [CutList, setCutList] = useState([]);
    const [EmptyCutList, setEmptyCutList] = useState(
        Array.from({ length: 30 }, () => 0)
    );

    const onScriptChange = (event) => {
        setScript(event.currentTarget.value);
    };

    const onNameChange = (event) => {
        setName(event.currentTarget.value);
    };

    const onClick_background = () => {
        setSidBar_b(true);
        setSidBar_c(false);
        setSidBar_bgm(false);
        setSidBar_sound(false);
    };

    const onClick_character = () => {
        setSidBar_b(false);
        setSidBar_c(true);
        setSidBar_bgm(false);
        setSidBar_sound(false);
    };

    const onClick_bgm = () => {
        setSidBar_b(false);
        setSidBar_c(false);
        setSidBar_bgm(true);
        setSidBar_sound(false);
    };

    const onClick_sound = () => {
        setSidBar_b(false);
        setSidBar_c(false);
        setSidBar_bgm(false);
        setSidBar_sound(true);
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
        console.log(123456, BgmFile);
        console.log(123456, SoundFile);
        setCutList((oldArray) => [
            ...oldArray.slice(0, CutNumber),
            Cut,
            ...oldArray.slice(CutNumber + 1, 30),
        ]);
        console.log(CutList.length, CutNumber);
        if (CutList.length === CutNumber) {
            setEmptyCutList((oldArray) => [
                ...oldArray.slice(0, EmptyCutList.length - 1),
            ]);
        }
    };

    useEffect(() => {
        console.log(CutList);
    }, [CutList]);

    const displayCut = (index) => {
        setBackgroundImg(CutList[index].background);
        setCharacterList(CutList[index].characterList);
        setScript(CutList[index].script);
        setName(CutList[index].name);
        setBgmFile(CutList[index].bgm);
        console.log(1234568, CutList[index].bgm);
        setSoundFile(CutList[index].sound);
        console.log(1234568, CutList[index].sound);
    };

    const onClick_GotoCut = (index) => {
        console.log(CutNumber);
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

    const onSubmit_saveScene = (event) => {
        event.preventDefault();

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
            ...CutList.slice(CutNumber + 1, 30),
        ];

        if (window.confirm("게임 제작을 완료하시겠습니까?")) {
            const variable = {
                gameId: gameId,
                writer: userId.userData._id,
                nextList: [],
                cutList: submitCutList,
                isFirst: 1,
            };
            Axios.post("/api/scene/save", variable).then((response) => {
                if (response.data.success) {
                    message
                        .loading("게임 업로드 중..", 1.5)
                        .then(() =>
                            message.success("게임 제작이 완료되었습니다.", 1.5)
                        );
                    setTimeout(() => {
                        props.history.push("/");
                    }, 1000);
                } else {
                    message.error("DB에 문제가 있습니다.");
                }
            });
        } else {
            message.error("제출 취소요");
        }
    };
    var elem = document.getElementsByClassName("scene__SceneBox_container");
    if (elem.children) {
        console.log("EEE");
        var child = elem.children[CutNumber];
        child.style.backgroundColor = "blue";
    }

    const display_SceneBox = CutList.map((Cut, index) => {
        if (CutNumber === index) {
            return (
                <div className="scene__CurrentSceneBox" key={`${index}`}></div>
            );
        } else {
            return (
                <div
                    className="scene__SceneBox"
                    key={`${index}`}
                    onClick={() => onClick_GotoCut(index)}
                ></div>
            );
        }
    });

    const display_EmptyBox = EmptyCutList.map((EmptyCut, index) => {
        if (CutNumber - CutList.length === index) {
            console.log(111, CutNumber, index);
            return (
                <div className="scene__CurrentSceneBox" key={`${index}`}></div>
            );
        } else {
            console.log(222, CutNumber, index);
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

    return (
        <div className="scenemake__container">
            {/* //?main Screen */}
            <div className="scenemake__main">
                <div className="scene__SceneBox_container">
                    {CutNumber}
                    {display_SceneBox}
                    {display_EmptyBox}
                    {CutList.length}
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
                    <Button type="primary" onClick={onSubmit_saveScene}>
                        Submit
                    </Button>
                    {/* <ModalSubmit/> */}
                </div>
            </div>
            {/* //?toggleBar */}
            <div className="scenemake__toggleBar">
                {SidBar_b && (
                    <BackgroundSideBar
                        gameId={gameId}
                        setBackgroundImg={setBackgroundImg}
                    />
                )}
                {SidBar_c && (
                    <CharacterSideBar
                        gameId={gameId}
                        CharacterList={CharacterList}
                        setCharacterList={setCharacterList}
                    />
                )}
                {SidBar_bgm && (
                    <BgmSideBar
                        bgm_audio={bgm_audio}
                        gameId={gameId}
                        setBgmFile={setBgmFile}
                    />
                )}
                {SidBar_sound && (
                    <SoundSideBar
                        sound_audio={sound_audio}
                        gameId={gameId}
                        setSoundFile={setSoundFile}
                    />
                )}
            </div>
            <div className="scenemake__toggleButton_container">
                <div
                    className="scenemake__btn_sidebar"
                    onClick={onClick_background}
                >
                    back
                </div>
                <div
                    className="scenemake__btn_sidebar"
                    onClick={onClick_character}
                >
                    char
                </div>
                <div
                    className="scenemake__btn_sidebar"
                    onClick={onClick_script}
                >
                    script
                </div>{" "}
                <div className="scenemake__btn_sidebar" onClick={onClick_bgm}>
                    bgm
                </div>
                <div className="scenemake__btn_sidebar" onClick={onClick_sound}>
                    sound
                </div>
            </div>
        </div>
    );
}

export default SceneMakePage;
