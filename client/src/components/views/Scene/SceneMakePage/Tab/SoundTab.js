import React, { useEffect, useState } from "react";
import { Col, message } from "antd";
import MyDropzone from "../../../Dropzone/MyDropzone";
import "../SceneMakeModal.css";
import "./MusicTab.css";

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
            setTypeQueue(oldArray => [...oldArray, 3])
            setSoundBlobNames(oldArray => [...oldArray, files[i]])
            setSoundBlobList(oldArray => [...oldArray, URL.createObjectURL(files[i])])
        }
    };

    // 왜 인자로 넘어온 game이 처음에 존재하지 않는지 모르겠음
    useEffect(() => {
        if (game.sound)
            setSoundCards(game.sound.map((element, index) => {
                return <div className="largeBox13" key={index}>
                    {(index + 1) % 2 ?
                        <div>
                            <img className="smallBox13"
                                // style={index == 0 ? { position: "flex" } : { position: "flex" }}
                                src="http://localhost:5000/uploads\music_icon.jpg"
                                alt="img"
                            />
                            {element.name}
                        </div>
                        :
                        <div>
                            <img className="smallBox23"
                                // style={index == 0 ? { position: "flex" } : { position: "flex" }}
                                src="http://localhost:5000/uploads\music_icon.jpg"
                                alt="img"
                            />
                            {element.name}
                        </div>
                    }
                </div>
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
                return <div className="largeBox13" key={index}>
                    {(index + 1) % 2 ?
                        <div>
                            <img className="smallBox13"
                                // style={index == 0 ? { position: "flex" } : { position: "flex" }}
                                src="http://localhost:5000/uploads\music_icon.jpg"
                                alt="img"
                            />
                            {soundBlobNames[index].name}
                        </div>
                        :
                        <div>
                            <img className="smallBox23"
                                // style={index == 0 ? { position: "flex" } : { position: "flex" }}
                                src="http://localhost:5000/uploads\music_icon.jpg"
                                alt="img"
                            />
                            {soundBlobNames[index].name}
                        </div>
                    }
                </div>
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
            <div className="music-container">
                {soundCards !== 0 && <div>{soundCards}</div>}
                {blobCards !== 0 && <div>{blobCards}</div>}
            </div>
        </div>
    );
}

export default SoundTab;
