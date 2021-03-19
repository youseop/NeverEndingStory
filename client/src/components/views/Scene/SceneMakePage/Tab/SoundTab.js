import React, { useEffect, useState } from "react";
import { Col, message } from "antd";
import MyDropzone from "../../../Dropzone/MyDropzone";
import "../SceneMakeModal.css";

function SoundTab({ game, setFileQueue, setTypeQueue, setSoundBlobList, soundBlobList, setSoundBlobNames, soundBlobNames }) {
    const [soundCards, setSoundCards] = useState([]);
    const [blobCards, setBlobCards] = useState([]);

    const onDrop = (files) => {
        for (var i = 0; i < files.length; i++) {
            if (!files[i]) {
                message.error("10MB 이하의 음원 파일을 업로드해주세요.");
                return;
            }
            setFileQueue(oldArray => [...oldArray, files[i]])
            setTypeQueue(oldArray => [...oldArray, 4])
            setSoundBlobNames(oldArray => [...oldArray, files[i]])
            setSoundBlobList(oldArray => [...oldArray, URL.createObjectURL(files[i])])
        }
    };

    // 왜 인자로 넘어온 game이 처음에 존재하지 않는지 모르겠음
    useEffect(() => {
        if (game.sound)
            setSoundCards(game.sound.map((element, index) => {
                return <Col key={index} lg={6} md={8} xs={24}>
                    <div style={{ position: "relative" }}>
                        <img
                            style={{ width: "50px", height: "50px" }}
                            src="http://localhost:5000/uploads\music_icon.jpg"
                            alt="img"
                        />
                        {element.name}
                    </div>
                    <br />
                </Col>
            }))
    }, [game]);

    const onClick_music = () => {
        //     setBgmFile(sound);
        //     bgm_audio.src = sound.music;
        //     bgm_audio.play();
    };

    useEffect(() => {
        if (soundBlobList)
            setBlobCards(soundBlobList.map((element, index) => {
                return <Col key={index} lg={6} md={8} xs={24}>
                    <div style={{ position: "relative" }} onClick={onClick_music}>
                        <img
                            style={{ width: "50px", height: "50px" }}
                            src="http://localhost:5000/uploads\music_icon.jpg"
                            alt="img"
                        />
                        {soundBlobNames[index].name}
                    </div>
                    <br />
                </Col>
            }))
    }, [soundBlobList]);

    return (
        <div>
            <MyDropzone
                onDrop={onDrop}
                multiple={true}
                maxSize={10485761} // 10MB + 1
                accept="audio/*"
            >
            </MyDropzone>
            {soundCards !== 0 && <div>{soundCards}</div>}
            {blobCards !== 0 && <div>{blobCards}</div>}
        </div>
    );
}

export default SoundTab;
