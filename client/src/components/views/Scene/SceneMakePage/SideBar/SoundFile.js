import React from "react";
import { LOCAL_HOST } from "../../../../Config"

function SoundFile({ sound_audio, sound, setSoundFile }) {
    const onClick_music = () => {
        setSoundFile(sound);
        sound_audio.src = sound.music;
        sound_audio.play();
    };

    return (
        <div
            className="bgmSidebar_box"
            onClick={onClick_music}
        >
            {sound.name}
        </div>
    );
}

export default SoundFile;
