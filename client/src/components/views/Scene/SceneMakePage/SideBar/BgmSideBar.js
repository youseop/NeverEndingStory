import { Button } from 'antd';
import React from "react";
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

    const setModal = () => {
        setMakeModalState(3);
    }

    return (
        <div className="sidebar__container">
            <Button
                type="primary"
                style={{ fontSize: "15px" }}
                onClick={setModal}>
                추가
            </Button>
            <div>{renderBgm}</div>
        </div>
    );
}

export default BgmSideBar;
