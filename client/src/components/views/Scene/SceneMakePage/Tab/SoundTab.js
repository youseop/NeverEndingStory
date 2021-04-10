import React, { useEffect, useState } from "react";
import { message } from "antd";
import MyDropzone from "../../../Dropzone/MyDropzone";
import "../EssetModal.css";
import "./MusicTab.css";

let sound_audio = new Audio();
function SoundTab({ gameDetail, setFileQueue, setTypeQueue, setSoundBlobList, soundBlobList, setSoundBlobNames, soundBlobNames, uploadFlag }) {
    const [soundCards, setSoundCards] = useState([]);
    const [blobCards, setBlobCards] = useState([]);
    const [toggle, setToggle] = useState(0);

    const onDrop = (files) => {
        for (var i = 0; i < files.length; i++) {
            if (!files[i]) {
                message.error("10MB 이하의 음원 파일을 업로드해주세요.");
                return;
            }
            setFileQueue(oldArray => [...oldArray, files[i]])
            setTypeQueue(oldArray => [...oldArray, 3])
            setSoundBlobNames(oldArray => [...oldArray, files[i]])
            setSoundBlobList(oldArray => [...oldArray, URL.createObjectURL(files[i])])
        }
    };

    // 왜 인자로 넘어온 game이 처음에 존재하지 않는지 모르겠음
    useEffect(() => {
        if (gameDetail.sound)
            setSoundCards(gameDetail.sound.map((element, index) => {
                let cutIdx = sound_audio.src.lastIndexOf("/") + 1;
                let sound_uri = decodeURI(sound_audio.src.substr(cutIdx))
                return (
                    <div className={`bgmTab_text_box ${sound_uri === element.music.substr(cutIdx)}`} key={index}
                        onClick={() => {
                            if (sound_audio.paused || sound_uri !== element.music.substr(cutIdx)) {
                                sound_audio.src = (element.music)
                                sound_audio.play();
                            } else {
                                sound_audio.src = ""
                                sound_audio.pause();
                            }
                            setToggle(toggle => toggle + 1);
                        }}>
                        {element.name}
                    </div>
                )
            }))
    }, [gameDetail, toggle]);

    useEffect(() => {
        if (soundBlobList)
            setBlobCards(soundBlobList.map((element, index) => {
                return (
                    <div className={`bgmTab_text_box ${sound_audio.src === element}`} key={index}
                        onClick={() => {
                            if (sound_audio.paused || sound_audio.src !== element) {
                                sound_audio.src = (element)
                                sound_audio.play();
                            } else {
                                sound_audio.src = ""
                                sound_audio.pause();
                            }
                            setToggle(toggle => toggle + 1);
                        }}>
                        {soundBlobNames[index].name}
                    </div>
                )
            }))
    }, [soundBlobList, toggle]);

    useEffect(() => {
        return () => {
            sound_audio.pause();
            sound_audio.src = ""
        };
    }, []);

    return (
        <div className="bgmTab_container">
            <div className="bgmTab_dropzone">
                <MyDropzone
                    onDrop={onDrop}
                    multiple={true}
                    maxSize={10485761} // 10MB + 1
                    accept="audio/*"
                    type="sound"
                    icon="audio"
                    uploadFlag={uploadFlag}
                >
                </MyDropzone>
            </div>
            <div className="bgmTab_Box">
                {soundCards !== 0 && <div>{soundCards}</div>}
                {blobCards !== 0 && <div>{blobCards}</div>}
            </div>
        </div>
    );
}

export default SoundTab;
