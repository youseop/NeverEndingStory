import React, { useEffect, useState } from "react";
import { Col, message } from "antd";
import MyDropzone from "../../../Dropzone/MyDropzone";
import "../EssetModal.css";
import "./BackgroundTab.css";
import "./Upload.css";

import AssetLibraryModal from "../AssetLibraryModal"


function BackgroundTab({ gameDetail, setFileQueue, setTypeQueue, setBackBlobList, backBlobList, assetUsedFlag, blobAssetList }) {
    const [LibraryModalVisible, setLibraryModalVisible] = useState(false)
    const [backgroundCards, setBackgroundCards] = useState("");
    const [blobCards, setBlobCards] = useState("");
    const onDrop = (files) => {
        for (var i = 0; i < files.length; i++) {
            if (!files[i]) {
                message.error("10MB 이하의 이미지 파일을 업로드해주세요.");
                return;
            }
            setFileQueue(oldArray => [...oldArray, files[i]])
            setTypeQueue(oldArray => [...oldArray, 1])
            setBackBlobList(oldArray => [...oldArray, URL.createObjectURL(files[i])])
        }
    };


    // 왜 인자로 넘어온 game이 처음에 존재하지 않는지 모르겠음
    useEffect(() => {
        if (gameDetail.background)
            setBackgroundCards(gameDetail.background.map((element, index) => {
                return <div className="backgroundTab_image_box" key={index}>
                    <img className="backgroundTab_image"
                        src={element.image}
                        alt="img"
                    />
                </div>
            }))
    }, [gameDetail]);

    useEffect(() => {
        if (backBlobList)
            setBlobCards(backBlobList.map((element, index) => {
                return <div className="backgroundTab_image_box" key={index}>
                    <img className="backgroundTab_image"
                        src={element}
                        alt="img"
                    />
                </div>
            }))
    }, [backBlobList]);


    return (
        <div className="backgroundTab_container">
            <div className="upload_container">
                <div className="upload_library"
                    onClick={() => setLibraryModalVisible(true)}>
                    배경 저장소
                </div>
                <AssetLibraryModal
                    visible={LibraryModalVisible}
                    setVisible={setLibraryModalVisible}
                    assetType="background"
                    assetUsedFlag={assetUsedFlag}
                    setBlob={setBackBlobList}
                    blobAssetList={blobAssetList}
                />
                <div className="backgroundTab_dropzone">
                    <MyDropzone
                        onDrop={onDrop}
                        multiple={true}
                        maxSize={10485761} // 10MB + 1
                        accept="image/*"
                        type="background"
                        icon="image"
                    >
                    </MyDropzone>

                </div>

            </div>
            <div className="backgroundTab_Box">
                <div>{backgroundCards} {blobCards}</div>
            </div>
        </div>
    )
}

export default BackgroundTab;
