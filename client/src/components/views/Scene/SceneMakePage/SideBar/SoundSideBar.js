import { Button } from 'antd';
import React from "react";
import "./SoundSideBar.css";

import SoundFile from "./SoundFile";

function SoundSideBar({ gameDetail, sound_audio, setSoundFile, setMakeModalState }) {

    const renderSound = gameDetail.sound.map((sound, index) => {
        return (
            <div className="sound" key={`${index}`}>
                <SoundFile
                    sound_audio={sound_audio}
                    sound={sound}
                    setSoundFile={setSoundFile}
                />
                {/* <img src={`${sound.image}`} alt="img"/> */}
            </div>
        );
    });

    const setModal = () => {
        setMakeModalState(4);
    }

    return (
        <div className="sidebar__container">
            <Button onClick={setModal} type="primary" style={{ background: "black" }}>
                추가
            </Button>
            <div>{renderSound}</div>
        </div>
    );
}

export default SoundSideBar;
