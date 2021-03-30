import { Button } from 'antd';
import React, { memo } from "react";
import "./BgmSideBar.css";

import BgmFile from "./BgmFile";

function BgmSideBar({ gameDetail, bgm_audio, setBgmFile, setMakeModalState }) {

    const renderBgm = gameDetail.bgm.map((bgm, index) => {
        return (
            <div className="bgm" key={`${index}`}>
                <BgmFile
                    bgm_audio={bgm_audio}
                    bgm={bgm}
                    setBgmFile={setBgmFile}
                />
                {/* <img src={`${bgm.image}`} alt="img"/> */}
            </div>
        );
    });

    return (
        <div className="sidebar__container">
            <div>{renderBgm}</div>
        </div>
    );
}

export default memo(BgmSideBar);
