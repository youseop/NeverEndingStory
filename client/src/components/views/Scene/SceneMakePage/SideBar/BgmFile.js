import React from "react";
import { LOCAL_HOST } from "../../../../Config"

function BgmFile({ bgm_audio, bgm, setBgmFile }) {
    const onClick_music = () => {
        setBgmFile(bgm);
        bgm_audio.src = bgm.music;
        bgm_audio.play();
    };

    return (
        <div
            className="bgmSidebar_box"
            onClick={onClick_music}
        >
            {bgm.name}
        </div>
    );
}

export default BgmFile;
