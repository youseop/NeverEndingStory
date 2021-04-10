import { message } from "antd";
import React from "react";
import { LOCAL_HOST } from "../../../../Config"

function BgmFile({ bgm_audio, bgm, setBgmFile, setReload }) {
    let cutIdx = bgm_audio.src.lastIndexOf("/") + 1;
    let bgm_uri = decodeURI(bgm_audio.src.substr(cutIdx))
    message.info(`${cutIdx}, ${bgm_audio.src}, ${bgm_uri}, ${bgm.music}, ${bgm.music.substr(cutIdx)}`)
    console.log(123, cutIdx)
    console.log(456, bgm_audio.src)
    console.log(789, bgm_uri)
    console.log(999, bgm.music)
    console.log(1000, bgm.music.substr(cutIdx))
    const onClick_music = () => {
        if (bgm_uri === bgm.music.substr(cutIdx)) {
            bgm_audio.src = ""
            setBgmFile("");
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
