import React from "react";

function BgmFile({ bgm_audio, bgm, setBgmFile }) {
    const onClick_music = () => {
        setBgmFile(bgm);
        bgm_audio.src = bgm.music;
        bgm_audio.play();
    };

    return (
        <div onClick={onClick_music}>
            <img src="http://localhost:5000/uploads\music_icon.jpg" alt="img" />
            {bgm.name}
        </div>
    );
}

export default BgmFile;