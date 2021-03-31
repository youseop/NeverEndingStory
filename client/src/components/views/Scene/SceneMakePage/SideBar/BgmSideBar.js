import { Button } from 'antd';
import React, { memo } from "react";
import "./BgmSideBar.css";

import BgmFile from "./BgmFile";

function BgmSideBar({ gameDetail, bgm_audio, setBgmFile, setMakeModalState }) {

    const renderBgm = gameDetail.bgm.map((bgm, index) => {
        return (
            <div
                className="bgmSidebar_box"
                key={`${index}`}>
                <BgmFile
                    bgm_audio={bgm_audio}
                    bgm={bgm}
                    setBgmFile={setBgmFile}
                />
            </div>
        );
    });

    return (
        <div className="modal">
            <div className="bgmSidebar__container">
                <div>{renderBgm}</div>
            </div>
        </div>
    );
}

export default memo(BgmSideBar);
