import { FileAddOutlined } from '@ant-design/icons';
import React, { memo } from "react";
import "./BgmSideBar.css";

import BgmFile from "./BgmFile";

function BgmSideBar({ gameDetail, bgm_audio, setBgmFile, onSetModal }) {

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
                {gameDetail?.bgm?.length === 0 &&
                    <div>
                        <FileAddOutlined onClick={onSetModal}
                            className="sidebar_add_esset_btn" />
                        <div className="sidebar_line" />
                    </div>
                }
                <div>{renderBgm}</div>
            </div>
        </div>
    );
}

export default memo(BgmSideBar);
