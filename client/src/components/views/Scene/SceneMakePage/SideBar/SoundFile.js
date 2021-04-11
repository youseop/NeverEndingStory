import React from "react";
import { LOCAL_HOST } from "../../../../Config"

function SoundFile({ sound_audio, sound, setSoundFile, setReload }) {
    let cutIdx = sound_audio.src.lastIndexOf("/") + 1;
    let sound_uri = decodeURI(sound_audio.src.substr(cutIdx))
    const onClick_music = () => {
        if (sound_uri === decodeURI(sound.music.substr(cutIdx))) {
            sound_audio.src = "";
            setSoundFile("");
        } else {
            sound_audio.src = sound.music;
            sound_audio.play();
            setSoundFile(sound);
        }
        setReload(reload => reload + 1);
    };

 
    return (
        <div
            className={`bgmSidebar_box ${sound_uri === decodeURI(sound.music.substr(cutIdx))}`}
            onClick={onClick_music}
        >
            {sound.name}
        </div>
    );
}

export default SoundFile;
