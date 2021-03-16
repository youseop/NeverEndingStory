import React from "react";
var audio = new Audio();

function SoundFile({ sound_audio, sound, setSoundFile }) {
    const onClick_music = () => {
        setSoundFile(sound);
        sound_audio.src = sound.music;
        sound_audio.play();
    };

    return (
        <div onClick={onClick_music}>
            <img src="http://localhost:5000/uploads\music_icon.jpg" alt="img" />
            {sound.name}
        </div>
    );
}

export default SoundFile;
