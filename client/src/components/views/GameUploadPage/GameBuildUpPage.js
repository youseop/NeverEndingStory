import React, { useEffect, useState } from "react";
import { Col, Row, Typography, Button, Form, Icon, message } from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";
import "./GameBuildUpPage";

const { Title } = Typography;

const extension = {
    image: [".jpg", ".png", ".jpeg", ".GIF"],
    music: [".mp3", ".wav", ".wmv", ".wma", ".flac"],
};

function GameBuildUpPage(props) {
    const [filePath, setFilePath] = useState("");
    const [fileState, setFileState] = useState("");
    const [cur_game, setGame] = useState([]);
    const [characterCards, setCharacterCards] = useState([]);
    const [backgroundCards, setBackgroundCards] = useState([]);
    const [bgmCards, setBgmCards] = useState([]);
    const [soundCards, setSoundCards] = useState([]);
    const gameId = props.match.params.gameId;

    const game_form = {
        gameId: gameId,
    };

    useEffect(() => {
        Axios.post("/api/game/getgamedetail", game_form).then((response) => {
            if (response.data.success) {
                setGame(response.data.gameDetail);
            } else {
                message.error("game load에 실패했습니다.");
            }
        });
    }, [filePath]);

    useEffect(() => {
        //character
        if (cur_game.character) {
            const tempCharacterCards = cur_game.character.map((_, index) => {
                return (
                    <Col key={index} lg={6} md={8} xs={24}>
                        <div style={{ position: "relative" }}>
                            <img
                                style={{ width: "50px", height: "50px" }}
                                src={`${cur_game.character[index].image}`}
                            />
                        </div>
                        <br />
                    </Col>
                );
            });
            setCharacterCards(tempCharacterCards);
        }
        //background
        if (cur_game.background) {
            const backgroundCards = cur_game.background.map((_, index) => {
                return (
                    <Col key={index} lg={6} md={8} xs={24}>
                        <div style={{ position: "relative" }}>
                            <img
                                style={{ width: "50px", height: "50px" }}
                                src={`${cur_game.background[index].image}`}
                            />
                        </div>
                        <br />
                    </Col>
                );
            });
            setBackgroundCards(backgroundCards);
        }
        //bgm
        if (cur_game.bgm) {
            const bgmCards = cur_game.bgm.map((_, index) => {
                return (
                    <Col key={index} lg={6} md={8} xs={24}>
                        <div style={{ position: "relative" }}>
                            <img
                                style={{ width: "20px", height: "20px" }}
                                src="http://localhost:5000/uploads\music_icon.jpg"
                                // src="http://localhost:5000/music_icon.jpg"
                            />
                            {cur_game.bgm[index].name}
                        </div>
                        <br />
                    </Col>
                );
            });
            setBgmCards(bgmCards);
        }
        //sound
        if (cur_game.sound) {
            const soundCards = cur_game.sound.map((_, index) => {
                return (
                    <Col key={index} lg={6} md={8} xs={24}>
                        <div style={{ position: "relative" }}>
                            <img
                                style={{ width: "20px", height: "20px" }}
                                src="http://localhost:5000/uploads\music_icon.jpg"
                                // src="http://localhost:5000/music_icon.jpg"
                            />
                            {cur_game.sound[index].name}
                        </div>
                        <br />
                    </Col>
                );
            });
            setSoundCards(soundCards);
        }
    }, [cur_game]);

    const onDrop = (files) => {
        //check is_file ok
        for (var i = 0; i < files.length; i++) {
            if (!files[i]) {
                message.error("손상된 파일입니다.");
                return;
            }

            let dotIdx = files[i].name.lastIndexOf(".");
            if (dotIdx == -1) {
                message.error(files[i].name + "은 확장자가 없는 파일입니다.");
                return;
            }

            let cur_extension = files[i].name.substr(dotIdx, 10000);
            if (
                //image check
                (fileState == 1 || fileState == 2) &&
                extension.image.indexOf(cur_extension) == -1
            ) {
                message.error(
                    files[i].name + "은 지원하지 않는 이미지 확장자 파일입니다."
                );
                return;
            }

            if (
                //sound check
                (fileState == 3 || fileState == 4) &&
                extension.music.indexOf(cur_extension) == -1
            ) {
                message.error(
                    files[i].name + "은 지원하지 않는 음원 확장자 파일입니다."
                );
                return;
            }
        }

        for (var i = 0; i < files.length; i++) {
            let formData = new FormData();
            const config = {
                header: { "content-type": "multipart/form-data" }, //content type을 같이 보내줘야한다!
            };
            formData.append("file", files[i]);
            let file_name = files[i].name;
            Axios.post("/api/game/uploadfiles", formData, config).then(
                (response) => {
                    // console.log(response);
                    if (response.data.success) {
                        console.log(response.data.url);
                        // console.log("setFilePath");
                        setFilePath(response.data.url);

                        switch (fileState) {
                            case 1:
                                const characterForm = {
                                    gameId: gameId,
                                    character: {
                                        name: file_name,
                                        image: `http://localhost:5000/${response.data.url}`,
                                    },
                                };
                                Axios.post(
                                    "/api/game/putCharacterImg",
                                    characterForm
                                ).then((response) => {
                                    if (response.data.success) {
                                        setFilePath(response.data.url);
                                    } else {
                                        message.error("캐릭터 업데이트 실패");
                                    }
                                });
                                return;
                            case 2: //background
                                console.log("background");
                                const backgroundForm = {
                                    gameId: gameId,
                                    background: {
                                        name: file_name,
                                        image: `http://localhost:5000/${response.data.url}`,
                                    },
                                };
                                Axios.post(
                                    "/api/game/putBackgroundImg",
                                    backgroundForm
                                ).then((response) => {
                                    if (response.data.success) {
                                        setFilePath(response.data.url);
                                    } else {
                                        message.error("배경 업데이트 실패");
                                    }
                                });
                                return;
                            case 3:
                                console.log("bgm");
                                const bgmForm = {
                                    gameId: gameId,
                                    bgm: {
                                        name: file_name,
                                        music: `http://localhost:5000/${response.data.url}`,
                                    },
                                };
                                Axios.post("/api/game/putBgm", bgmForm).then(
                                    (response) => {
                                        if (response.data.success) {
                                            setFilePath(response.data.url);
                                        } else {
                                            message.error("배경음 업데이트 실패");
                                        }
                                    }
                                );
                                return;

                            case 4:
                                console.log("sound");
                                const soundForm = {
                                    gameId: gameId,
                                    sound: {
                                        name: file_name,
                                        music: `http://localhost:5000/${response.data.url}`,
                                    },
                                };
                                Axios.post(
                                    "/api/game/putSound",
                                    soundForm
                                ).then((response) => {
                                    if (response.data.success) {
                                        setFilePath(response.data.url);
                                    } else {
                                        message.error("효과음 업데이트 실패");
                                    }
                                });
                                return;
                            default:
                                message.error("정의되지 않은 업로드 버튼입니다.");
                                return;
                        }
                    } else {
                        message.error("업로드 실패");
                    }
                }
            );
        }
    };
    // console.log(filePath);
    const onSubmit = (event) => {
        event.preventDefault();
        // console.log(props.match.params);
        // console.log(gameId);
        props.history.push(`/scene/make/${gameId}`);
    };

    const onCharacter = () => {
        setFileState(1);
    };
    const onBackground = () => {
        setFileState(2);
    };
    const onBgm = () => {
        setFileState(3);
    };
    const onSound = () => {
        setFileState(4);
    };

    return (
        <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
            <div style={{ marginBottom: "2rem" }}>
                <Title level={4}>게임에 필요한 캐릭터를 추가해주세요</Title>
            </div>
            <Form>
                <div
                    style={{ display: "flex", justifyContent: "flex-start" }}
                    onClick={onCharacter}
                >
                    {/* Set click handler */}
                    {/* <button onClick={onBackground}> </button> */}
                    {/* drop zone */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={true}
                        maxSize={1000000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    border: "1px solid lightgray",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon
                                    type="plus"
                                    style={{ fontSize: "3rem" }}
                                />
                            </div>
                        )}
                    </Dropzone>
                    <Row>{characterCards}</Row>
                </div>
            </Form>

            <div style={{ marginBottom: "2rem" }}>
                <Title level={4}>게임에 필요한 배경을 추가해주세요</Title>
            </div>
            <Form>
                <div
                    // style={{ display: "flex", justifyContent: "space-between" }}
                    style={{ display: "flex", justifyContent: "flex-start" }}
                    onClick={onBackground}
                >
                    {/* drop zone */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={true}
                        maxSize={1000000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    border: "1px solid lightgray",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon
                                    type="plus"
                                    style={{ fontSize: "3rem" }}
                                />
                            </div>
                        )}
                    </Dropzone>
                    <Row>{backgroundCards}</Row>
                </div>
            </Form>

            <div style={{ marginBottom: "2rem" }}>
                <Title level={4}>게임에 필요한 음악을 추가해주세요</Title>
            </div>
            <Form>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                    onClick={onBgm}
                >
                    {/* drop zone */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={true}
                        maxSize={1000000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    border: "1px solid lightgray",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon
                                    type="plus"
                                    style={{ fontSize: "3rem" }}
                                />
                            </div>
                        )}
                    </Dropzone>
                    <Row>{bgmCards}</Row>
                </div>
            </Form>

            <div style={{ marginBottom: "2rem" }}>
                <Title level={4}>게임에 필요한 효과음을 추가해주세요</Title>
            </div>
            <Form>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                    onClick={onSound}
                >
                    {/* drop zone */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={true}
                        maxSize={1000000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    border: "1px solid lightgray",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon
                                    type="plus"
                                    style={{ fontSize: "3rem" }}
                                />
                            </div>
                        )}
                    </Dropzone>
                    <Row>{soundCards}</Row>
                </div>

                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Go to Last Step!!
                </Button>
            </Form>
        </div>
    );
}

export default GameBuildUpPage;
