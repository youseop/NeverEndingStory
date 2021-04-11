import { message } from "antd";
import React from "react";
import { LOCAL_HOST } from "../../../../Config"

function BgmFile({ bgm_audio, bgm, setBgmFile, setReload }) {
    const audio_src = bgm_audio.src;
    let cutIdx = bgm_audio.src.lastIndexOf("/") + 1;
    let bgm_uri = decodeURI(bgm_audio.src.substr(cutIdx))
    message.info(`${cutIdx}!!!!!!!!!!!!!!!!!!! ${bgm_audio.src}!!!!!!!!!!!!!!!!!!! ${bgm_uri}!!!!!!!!!!!!!!!!!!! ${bgm.music}!!!!!!!!!!!!!!!!!!! ${bgm.music.substr(cutIdx)}`)
    console.log("cut 넘버", cutIdx)
    console.log("decode 이전", bgm_audio.src)
    console.log("decode 이후", bgm_uri)
    console.log("자르기 이전", bgm.music)
    console.log("자르기 이후", bgm.music.substr(cutIdx))
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
            0 {bgm.name}<br />
            1 {cutIdx}<br />
            2 {bgm_audio.src}<br />
            3 {bgm_uri}<br />
            4 {bgm.music}<br />
            5 {bgm.music.substr(cutIdx)}<br />
            6 {audio_src}<br />
        </div>
    );
}

export default BgmFile;
