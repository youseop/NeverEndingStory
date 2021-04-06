import { FileAddOutlined } from '@ant-design/icons';
import React, { memo } from "react";
import "./BgmSideBar.css";

import BgmFile from "./BgmFile";

function BgmSideBar({ gameDetail, bgm_audio, setBgmFile, onEssetModal, isFirstScene, setReload, isWriter }) {

    const renderBgm = gameDetail.bgm.map((bgm, index) => {
        return (
            <div
                className="bgmSidebar_box"
                key={`${index}`}>
                <BgmFile
                    bgm_audio={bgm_audio}
                    bgm={bgm}
                    setBgmFile={setBgmFile}
                    setReload={setReload}
                />
            </div>
        );
    });

    return (
        <div className="modal">
            <div className="sidebar__container">
                {(isFirstScene.current || isWriter) &&
                    <FileAddOutlined onClick={onEssetModal}
                        className={gameDetail?.bgm?.length === 0 ?
                            "sidebar_add_esset_btn" : "sidebar_add_esset_btn_side"} />
                }
                <div>{renderBgm}</div>
            </div>
            {gameDetail?.bgm?.length === 0 && <div className="sidebar_line" />}
        </div>
    );
}

export default memo(BgmSideBar);
