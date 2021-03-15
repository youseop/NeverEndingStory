import Axios from "axios";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import "./BgmSideBar.css";

import BgmFile from "./BgmFile";

function BgmSideBar({ bgm_audio, gameId, setBgmFile }) {
    const [Bgm, setBgm] = useState([]);

    const variable = { gameId: gameId };
    useEffect(() => {
        Axios.post("/api/game/getgamedetail", variable).then((response) => {
            if (response.data.success) {
                if (response.data.gameDetail.bgm.length === 0) {
                    message.error("배경음악이 없습니다.");
                } else {
                    setBgm(response.data.gameDetail.bgm);
                }
            } else {
                alert("게임 정보를 로딩하는데 실패했습니다.");
            }
        });
    }, []);

    const renderBgm = Bgm.map((bgm, index) => {
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
            {Bgm && <div>{renderBgm}</div>}
        </div>
    );
}

export default BgmSideBar;
