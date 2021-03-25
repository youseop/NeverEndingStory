import React from "react";
import { LOCAL_HOST } from "../../../../Config"

function SoundFile({ sound_audio, sound, setSoundFile }) {
    const onClick_music = () => {
        setSoundFile(sound);
        sound_audio.src = sound.music;
        sound_audio.play();
    };

    return (
        <div onClick={onClick_music}>
            <img src={`http://${LOCAL_HOST}:5000/uploads/music_icon.jpg`} alt="img" />
            {sound.name}
        </div>
    );
}

export default SoundFile;
