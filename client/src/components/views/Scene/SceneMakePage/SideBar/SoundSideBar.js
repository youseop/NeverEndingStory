import Axios from "axios";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import "./SoundSideBar.css";

import SoundFile from "./SoundFile";

function SoundSideBar({ sound_audio, gameId, setSoundFile }) {
    const [Sound, setSound] = useState([]);

    const variable = { gameId: gameId };
    useEffect(() => {
        Axios.post("/api/game/getgamedetail", variable).then((response) => {
            if (response.data.success) {
                if (response.data.gameDetail.sound.length === 0) {
                    message.error("배경음악이 없습니다.");
                } else {
                    setSound(response.data.gameDetail.sound);
                }
            } else {
                alert("게임 정보를 로딩하는데 실패했습니다.");
            }
        });
    }, []);

    const renderSound = Sound.map((sound, index) => {
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
            {Sound && <div>{renderSound}</div>}
        </div>
    );
}

export default SoundSideBar;
