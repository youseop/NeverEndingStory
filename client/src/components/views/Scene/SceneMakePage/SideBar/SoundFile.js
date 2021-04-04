import React from "react";
import { LOCAL_HOST } from "../../../../Config"

function SoundFile({ sound_audio, sound, setSoundFile, setReload }) {
    let cutIdx = sound_audio.src.lastIndexOf("/") + 1;
    let sound_uri = decodeURI(sound_audio.src.substr(cutIdx))
    const onClick_music = () => {
        if (!sound_audio.paused && sound_uri === sound.music.substr(cutIdx)) {
            sound_audio.pause();
        } else {
            sound_audio.src = sound.music;
            sound_audio.play();
            setSoundFile(sound);
        }
        setReload(reload => reload + 1);
    };


    return (
        <div
            className={sound_uri === sound.music.substr(cutIdx) ?
                "bgmSidebar_box playing" : "bgmSidebar_box wait"}
            onClick={onClick_music}
        >
            {sound.name}
        </div>
    );
}

export default SoundFile;
