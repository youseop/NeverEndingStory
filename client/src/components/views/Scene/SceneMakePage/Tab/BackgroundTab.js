import React, { useEffect, useState } from "react";
import { Col, message } from "antd";
import MyDropzone from "../../../Dropzone/MyDropzone";
import "../SceneMakeModal.css";

function BackgroundTab({ game, setFileQueue, setTypeQueue, setBackBlobList, backBlobList }) {
    const [backgroundCards, setBackgroundCards] = useState([]);
    const [blobCards, setBlobCards] = useState([]);

    const onDrop = (files) => {
        for (var i = 0; i < files.length; i++) {
            if (!files[i]) {
                message.error("10MB 이하의 이미지 파일을 업로드해주세요.");
                return;
            }
            setFileQueue(oldArray => [...oldArray, files[i]])
            setTypeQueue(oldArray => [...oldArray, 2])
            setBackBlobList(oldArray => [...oldArray, URL.createObjectURL(files[i])])
        }
    };

    // 왜 인자로 넘어온 game이 처음에 존재하지 않는지 모르겠음
    useEffect(() => {
        if (game.background)
            setBackgroundCards(game.background.map((element, index) => {
                return <Col key={index} lg={6} md={8} xs={24}>
                    <div style={{ position: "relative" }}>
                        <img
                            style={{ width: "50px", height: "50px" }}
                            src={element.image}
                            alt="img"
                        />
                    </div>
                    <br />
                </Col>
            }))
    }, [game]);

    useEffect(() => {
        if (backBlobList)
            setBlobCards(backBlobList.map((element, index) => {
                return <Col key={index} lg={6} md={8} xs={24}>
                    <div style={{ position: "relative" }}>
                        <img
                            style={{ width: "50px", height: "50px" }}
                            src={element}
                            alt="img"
                        />
                    </div>
                    <br />
                </Col>
            }))
    }, [backBlobList]);

    return (
        <div>
            <MyDropzone
                onDrop={onDrop}
                multiple={true}
                maxSize={10485761} // 10MB + 1
                accept="image/*"
            >
            </MyDropzone>
            {backgroundCards !== 0 && <div>{backgroundCards}</div>}
            {blobCards !== 0 && <div>{blobCards}</div>}
        </div>
    );
}

export default BackgroundTab;
