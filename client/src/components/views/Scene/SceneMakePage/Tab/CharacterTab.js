import React, { useEffect, useRef, useState } from "react";
import { message, Form } from "antd";
import MyDropzone from "../../../Dropzone/MyDropzone";
import "../EssetModal.css";
import "./CharacterTab.css";
import { SVG } from "../../../../svg/icon";
import useMouse from "../../../../functions/useMouse";

function CharacterTab({ blobGame, setBlobGame, charPageNum, setCharFileQueue, setCharBlobList }) {
    const [characterProfile, setCharacterProfile] = useState("");
    const [characterCards, setCharacterCards] = useState("");
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
            const profile = () => {
                // const img = new Image()
                // img.src = image;
                const image = blobGame.character[charPageNum.current].image_array[0]
                return (
                    <div>
                        <div className="characterTab_profile_image">
                            <img
                                // className={img.width > img.height ?
                                //     "characterTab_image_width" : "characterTab_image_height"}
                                className="characterTab_image"
                                src={image}
                                alt="img"
                            />
                        </div>

                        <Form>
                            <input
                                onChange={onNameChange}
                                value={blobGame.character[charPageNum.current].name}
                                className="characterTab_profile_name"
                                maxLength={15}
                                placeholder="이름을 입력해주세요." />
                            <textarea
                                onChange={onDescriptionChange}
                                value={blobGame.character[charPageNum.current].description}
                                maxLength={50}
                                className="characterTab_profile_text"
                                placeholder="설명을 입력해주세요." />
                            {/* <label>(혈액형/좋아하는 것 등 이모지넣을 수 있는 공간?)</label> */}
                        </Form>
                    </div>
                )
            }
            setCharacterProfile(profile);
            const cards = blobGame.character[charPageNum.current].image_array.map((image, index) => {
                // const img = new Image()
                // img.src = image;
                return (
                    <div
                        id={charPageNum.current}
                        key={index}
                        className="characterTab_cards"
                    >
                        <img
                            // className={img.width > img.height ?
                            //     "characterTab_image_width" : "characterTab_image_height"}
                            className="characterTab_image"
                            src={image}
                            alt="img"
                        />
                    </div>
                )
            })
            setCharacterCards(cards)
        } else {
            setCharacterProfile("");
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
        <div className="characterTab-container">
            {blobGame.character?.length > 0 &&
                blobGame.character?.length !== charPageNum.current &&
                <div>
                    <div>{characterProfile}</div>
                    <div className="characterTab_cards_Box">{characterCards}</div>
                    <div className="characterTab_char_dropzone"
                        id={charPageNum.current}>
                        <MyDropzone
                            onDrop={onDrop}
                            multiple={true}
                            maxSize={10485761} // 10MB + 1
                            accept="image/*"
                            type="character"
                            icon="image"
                        />
                    </div>
                    {blobGame.character &&
                        <div
                            className="characterTab_pagenum"
                        >
                            {charPageNum.current + 1}/{blobGame.character.length}
                        </div>
                    }
                </div>
            }
            {blobGame.character?.length === charPageNum.current &&
                <div
                    className="characterTab_empty_dropzone"
                    id={-1}>
                    <MyDropzone
                        onDrop={onDrop}
                        multiple={true}
                        maxSize={10485761} // 10MB + 1
                        accept="image/*"
                        type="character"
                        icon="image"
                    />
                    <div className="characterTab_instruct">
                        캐릭터를 추가해주세요
                    </div>
                </div>
            }
            {
                charPageNum.current !== 0 &&
                <div
                    className="characterTab_leftarrow"
                    onClick={() => {
                        charPageNum.current--
                        setIsUpdate(num => num + 1)
                    }}>
                    <SVG src="arrow_1" width="50" height="50" color="#222831" />
                </div>
            }
            {blobGame.character?.length > 0 &&
                blobGame?.character?.length !== charPageNum.current &&
                <div
                    className="characterTab_rightarrow"
                    onClick={() => {
                        charPageNum.current++
                        setIsUpdate(num => num + 1)
                    }}>
                    <SVG src="arrow_1" width="100%" height="100%" color="#222831" />
                </div>
            }
        </div>
    );
}

export default CharacterTab;
