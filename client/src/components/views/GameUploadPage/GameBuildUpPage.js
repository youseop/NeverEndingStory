import React, { useEffect, useState } from "react";
import { Col, Row, Typography, Button, Form, Icon } from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";
import "./GameBuildUpPage";

const { Title } = Typography;

function GameBuildUpPage(props) {
    const [filePath, setFilePath] = useState("");
    const [fileState, setFileState] = useState("");
    const [cur_game, setGame] = useState([]);
    const [characterCards, setCharacterCards] = useState([]);
    const [backgroundCards, setBackgroundCards] = useState([]);
    const gameId = props.match.params.gameId;

    const game_form = {
        gameId: gameId,
    };

    useEffect(() => {
        Axios.post("/api/game/getgamedetail", game_form).then((response) => {
            if (response.data.success) {
                setGame(response.data.gameDetail);
            } else {
                alert("game load에 실패했습니다.");
            }
        });
    }, [filePath]);

    useEffect(() => {
        //character
        if (cur_game.character) {
            const tempCharacterCards = cur_game.character.map(
                (character, index) => {
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
                }
            );
            setCharacterCards(tempCharacterCards);
        }
        //background
        if (cur_game.background) {
            const backgroundCards = cur_game.background.map(
                (background, index) => {
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
                }
            );
            setBackgroundCards(backgroundCards);
        }
    }, [cur_game]);

    const onDrop = (files) => {
        for (var i = 0; i < files.length; i++) {
            if (!files[i]) {
                alert("손상된 파일입니다.");
                return;
            }

            let formData = new FormData();
            const config = {
                header: { "content-type": "multipart/form-data" }, //content type을 같이 보내줘야한다!
            };
            formData.append("file", files[i]);

            Axios.post("/api/game/uploadfiles", formData, config).then(
                (response) => {
                    if (response.data.success) {
                        console.log("setFilePath");
                        setFilePath(response.data.url);

                        switch (fileState) {
                            case 1:
                                const characterImg = {
                                    gameId: gameId,
                                    character: {
                                        name: "default",
                                        image: `http://localhost:5000/${response.data.url}`,
                                    },
                                };
                                Axios.post(
                                    "/api/game/putCharacterImg",
                                    characterImg
                                ).then((response) => {
                                    if (response.data.success) {
                                        setFilePath(response.data.url);
                                    } else {
                                        alert("캐릭터 업데이트 실패");
                                    }
                                });
                                return;
                            case 2: //background
                                console.log("background");
                                const backgroundImg = {
                                    gameId: gameId,
                                    background: {
                                        name: "default",
                                        image: `http://localhost:5000/${response.data.url}`,
                                    },
                                };
                                Axios.post(
                                    "/api/game/putBackgroundImg",
                                    backgroundImg
                                ).then((response) => {
                                    if (response.data.success) {
                                        setFilePath(response.data.url);
                                    } else {
                                        alert("배경 업데이트 실패");
                                    }
                                });
                                return;

                            default:
                                alert("정의되지 않은 업로드 버튼입니다.");

                                return;
                        }
                    } else {
                        alert("업로드 실패");
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

    return (
        <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <Title level={2}>게임에 필요한 캐릭터를 추가해주세요</Title>
            </div>
            <Form>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
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
                    {/* thunb nail */}
                    {/* {filePath && (
                  <div>
                      <img
                          className="video__img"
                          src={`http://localhost:5000/${filePath}`}
                          alt="thumbnail"
                      />
                  </div> */}
                    {/* )} */}
                    <Row gutter={[32, 16]}>{characterCards}</Row>
                </div>

                <br />
                <br />
            </Form>

            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <Title level={2}>게임에 필요한 배경을 추가해주세요</Title>
            </div>
            <Form>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
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
                    {/* thunb nail */}
                    {/* {filePath && (
                  <div>
                      <img
                          className="video__img"
                          src={`http://localhost:5000/${filePath}`}
                          alt="thumbnail"
                      />
                  </div>
              )} */}
                    <Row gutter={[32, 16]}>{backgroundCards}</Row>
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
