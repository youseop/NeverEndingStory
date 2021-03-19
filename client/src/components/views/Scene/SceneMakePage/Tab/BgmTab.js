import React, { useEffect, useState } from "react";
import { Col, message } from "antd";
import MyDropzone from "../../../Dropzone/MyDropzone";
import "../SceneMakeModal.css";

function BgmTab({ game, setFileQueue, setTypeQueue, setBgmBlobList, bgmBlobList, setBgmBlobNames, bgmBlobNames }) {
    const [bgmCards, setBgmCards] = useState([]);
    const [blobCards, setBlobCards] = useState([]);

    const onDrop = (files) => {
        for (var i = 0; i < files.length; i++) {
            if (!files[i]) {
                message.error("10MB 이하의 음원 파일을 업로드해주세요.");
                return;
            }
            setFileQueue(oldArray => [...oldArray, files[i]])
            setTypeQueue(oldArray => [...oldArray, 3])
            setBgmBlobNames(oldArray => [...oldArray, files[i]])
            setBgmBlobList(oldArray => [...oldArray, URL.createObjectURL(files[i])])
        }
    };

    // 왜 인자로 넘어온 game이 처음에 존재하지 않는지 모르겠음
    useEffect(() => {
        if (game.bgm)
            setBgmCards(game.bgm.map((element, index) => {
                console.log(element)
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
        //     setBgmFile(bgm);
        //     bgm_audio.src = bgm.music;
        //     bgm_audio.play();
    };

    useEffect(() => {
        if (bgmBlobList)
            setBlobCards(bgmBlobList.map((element, index) => {
                return <Col key={index} lg={6} md={8} xs={24}>
                    <div style={{ position: "relative" }} onClick={onClick_music}>
                        <img
                            style={{ width: "50px", height: "50px" }}
                            src="http://localhost:5000/uploads\music_icon.jpg"
                            alt="img"
                        />
                        {bgmBlobNames[index].name}
                    </div>
                    <br />
                </Col>
            }))
    }, [bgmBlobList]);

    return (
        <div>
            <MyDropzone
                onDrop={onDrop}
                multiple={true}
                maxSize={10485761} // 10MB + 1
                accept="audio/*"
            >
            </MyDropzone>
            {bgmCards !== 0 && <div>{bgmCards}</div>}
            {blobCards !== 0 && <div>{blobCards}</div>}
        </div>
    );
}

export default BgmTab;
