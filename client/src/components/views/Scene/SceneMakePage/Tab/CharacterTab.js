import React, { useEffect, useState } from "react";
import { Col, message } from "antd";
import MyDropzone from "../../../Dropzone/MyDropzone";
import "../SceneMakeModal.css";
import "./CharacterTab.css";

function CharacterTab({ game, setFileQueue, setTypeQueue, setCharBlobList, charBlobList }) {
    const [characterCards, setCharacterCards] = useState([]);
    const [blobCards, setBlobCards] = useState([]);

    const onDrop = (files) => {
        for (var i = 0; i < files.length; i++) {
            if (!files[i]) {
                message.error("10MB 이하의 이미지 파일을 업로드해주세요.");
                return;
            }
            setFileQueue(oldArray => [...oldArray, files[i]])
            setTypeQueue(oldArray => [...oldArray, 1])
            setCharBlobList(oldArray => [...oldArray, URL.createObjectURL(files[i])])
        }
    };

    // 왜 인자로 넘어온 game이 처음에 존재하지 않는지 모르겠음
    useEffect(() => {
        if (game.character)
            setCharacterCards(game.character.map((element, index) => {
                return <div className="largeBox">
                    <img className="smallBox"
                        // style={index == 0 ? { position: "flex" } : { position: "flex" }}
                        src={element.image}
                        alt="img"
                    />
                </div>
            }))
    }, [game]);

    useEffect(() => {
        if (charBlobList)
            setBlobCards(charBlobList.map((element, index) => {
                return <div className="largeBox" key={index}>
                    <img className="smallBox"
                        // style={index == 0 ? { position: "flex" } : { position: "flex" }}
                        src={element}
                        alt="img"
                    />
                </div>
            }))
    }, [charBlobList]);

    return (
        <div>
            <MyDropzone
                onDrop={onDrop}
                multiple={true}
                maxSize={10485761} // 10MB + 1
                accept="image/*"
            >
            </MyDropzone>
            <div className="character-container">
                {characterCards !== 0 && <div>{characterCards}</div>}
                {blobCards !== 0 && <div>{blobCards}</div>}
            </div>
        </div>
    );
}

export default CharacterTab;
