import React, { useEffect, useRef, useState } from "react";
import { message, Form, Input } from "antd";
import MyDropzone from "../../../Dropzone/MyDropzone";
import { LeftCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons';
import "../SceneMakeModal.css";
import "./CharacterTab.css";
import useMouse from "../../../../functions/useMouse";

const { TextArea } = Input;

function CharacterTab({ blobGame, setBlobGame, charPageNum, setCharFileQueue, setCharBlobList }) {
    const [characterCards, setCharacterCards] = useState([]);
    const [isUpdate, setIsUpdate] = useState(0);
    const indexNum = useRef(0);

    const onNameChange = (event) => {
        setBlobGame(game => {
            game.character[charPageNum.current].name = event.currentTarget.value
            return game
        })
        setIsUpdate(num => num + 1)
    };

    const onDescriptionChange = (event) => {
        setBlobGame(game => {
            game.character[charPageNum.current].description = event.currentTarget.value
            return game
        })
        setIsUpdate(num => num + 1)
    };

    const onDrop = (files) => {
        for (var i = 0; i < files.length; i++) {
            if (!files[i]) {
                message.error("10MB 이하의 이미지 파일을 업로드해주세요.");
                return;
            }
            let curURL = URL.createObjectURL(files[i])
            setCharBlobList(oldArray => [...oldArray, curURL])

            //new Character
            if (indexNum.current === "-1") {
                setBlobGame(game => {
                    game.character = [...game.character, {
                        name: "",
                        description: "",
                        image_array: [curURL],
                    }]
                    return game
                })
                indexNum.current = blobGame.character.length - 1
            }
            else {
                setBlobGame(game => {
                    game.character[indexNum.current].image_array = [...game.character[indexNum.current].image_array, curURL]
                    return game
                })
            }
        }
        setCharFileQueue(oldArray => [...oldArray, { index: Number(indexNum.current), array: files }])
        setIsUpdate(num => num + 1)
    };

    // 왜 인자로 넘어온 game이 처음에 존재하지 않는지 모르겠음
    useEffect(() => {
        if (blobGame.character && charPageNum.current < blobGame.character.length) {
            const cards = blobGame.character[charPageNum.current].image_array.map((image, index) => {
                return (
                    <div
                        id={charPageNum.current}
                        className="largeBox" key={index}
                    >
                        <img className="smallBox"
                            src={image}
                            alt="img"
                        />

                        {index === 0 &&
                            <Form><label>이름</label>
                                <Input onChange={onNameChange} value={blobGame.character[charPageNum.current].name} />

                                <label>상세설정</label>
                                <TextArea onChange={onDescriptionChange} value={blobGame.character[charPageNum.current].description} />

                                {/* <label>(혈액형/좋아하는 것 등 이모지넣을 수 있는 공간?)</label> */}
                            </Form>
                        }

                        {(index === blobGame.character[charPageNum.current].image_array.length - 1) &&
                            <MyDropzone
                                onDrop={onDrop}
                                multiple={true}
                                maxSize={10485761} // 10MB + 1
                                accept="image/*"
                            />}
                    </div>
                )
            })
            setCharacterCards(cards)
        } else {
            setCharacterCards("")
        }

    }, [isUpdate, blobGame]);

    useMouse("mousedown", handleMouse)
    function handleMouse(event) {
        for (var i = 0; i < event.path.length; i++) {
            if (event.path[i].id) {
                indexNum.current = event.path[i].id
                return;
            }
        }
    }

    return (
        <div>
            <div className="character-container">
                {characterCards !== 0 && <div>{characterCards}</div>}
            </div>
            {
                blobGame.character && charPageNum.current === blobGame.character.length &&
                <div id={-1}>
                    <MyDropzone
                        onDrop={onDrop}
                        multiple={true}
                        maxSize={10485761} // 10MB + 1
                        accept="image/*"
                    />
                </div>
            }
            {
                charPageNum.current !== 0 && <LeftCircleTwoTone
                    style={{ fontSize: "3rem" }}
                    onClick={() => {
                        charPageNum.current--
                        setIsUpdate(num => num + 1)
                    }}
                    twoToneColor="#52c41a" />
            }
            {
                blobGame.character && charPageNum.current !== blobGame.character.length &&
                <RightCircleTwoTone
                    style={{ fontSize: "3rem" }}
                    onClick={() => {
                        charPageNum.current++
                        setIsUpdate(num => num + 1)
                    }}
                    twoToneColor="#52c41a" />
            }
            {blobGame.character && <div> {charPageNum.current}/{blobGame.character.length}</div>}
        </div>
    );
}

export default CharacterTab;
