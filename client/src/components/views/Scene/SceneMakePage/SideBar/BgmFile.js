import React from "react";
import { LOCAL_HOST } from "../../../../Config"

function BgmFile({ bgm_audio, bgm, setBgmFile, setReload }) {
    let cutIdx = bgm_audio.src.lastIndexOf("/") + 1;
    let bgm_uri = decodeURI(bgm_audio.src.substr(cutIdx))
    const onClick_music = () => {
        if (bgm_uri === bgm.music.substr(cutIdx)) {
            if (bgm_audio.paused) {
                bgm_audio.src = ""
                setBgmFile("");
            }
            else
                bgm_audio.pause();
        } else {
            bgm_audio.src = bgm.music;
            bgm_audio.play();
            setBgmFile(bgm);
        }
        setReload(reload => reload + 1);
    };

    return (
        <div
            className={`bgmSidebar_box ${bgm_uri === bgm.music.substr(cutIdx)}`}
            onClick={onClick_music}
        >
            {bgm.name}
        </div>
    );
}

export default BgmFile;
