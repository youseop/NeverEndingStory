import { Button } from 'antd';
import React, { memo } from "react";
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

    return (
        <div className="sidebar__container">
            <div>{renderSound}</div>
        </div>
    );
}

export default memo(SoundSideBar);
