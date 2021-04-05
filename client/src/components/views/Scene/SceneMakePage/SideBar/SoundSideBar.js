import { FileAddOutlined } from '@ant-design/icons';
import React, { memo } from "react";
import "./BgmSideBar.css";

import SoundFile from "./SoundFile";

function SoundSideBar({ gameDetail, sound_audio, setSoundFile, onEssetModal, isFirstScene, setReload, isWriter }) {
    const renderSound = gameDetail.sound.map((sound, index) => {
        return (
            <div
                className="bgmSidebar_box"
                key={`${index}`}>
                <SoundFile
                    sound_audio={sound_audio}
                    sound={sound}
                    setSoundFile={setSoundFile}
                    setReload={setReload}
                />
                {/* <img src={`${sound.image}`} alt="img"/> */}
            </div>
        );
    });

    return (
        <div className="modal">
            <div className="bgmSidebar__container">
                {(isFirstScene.current || isWriter) &&
                    <FileAddOutlined onClick={onEssetModal}
                        className={gameDetail?.sound?.length === 0 ?
                            "sidebar_add_esset_btn" : "sidebar_add_esset_btn_side"} />
                }
                {gameDetail?.bgm?.length === 0 && <div className="sidebar_line" />}
                <div>{renderSound}</div>
            </div>
        </div>
    );
}

export default memo(SoundSideBar);
