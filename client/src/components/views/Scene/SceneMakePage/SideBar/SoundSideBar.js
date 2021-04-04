import { FileAddOutlined } from '@ant-design/icons';
import React, { memo } from "react";
import "./BgmSideBar.css";

import SoundFile from "./SoundFile";

function SoundSideBar({ gameDetail, sound_audio, setSoundFile, onEssetModal, isFirstScene, setReload }) {

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
                {gameDetail?.sound?.length === 0 &&
                    <div>
                        {isFirstScene.current &&
                            <FileAddOutlined onClick={onEssetModal}
                                className="sidebar_add_esset_btn" />
                        }
                        <div className="sidebar_line" />
                    </div>
                }
                <div>{renderSound}</div>
            </div>
        </div>
    );
}

export default memo(SoundSideBar);
