import "./SceneEndingPage.css";
import React, { useState } from "react";
import FirstSceneTeleport from "../SceneTeleport/FirstSceneTeleport";
import PrevSceneTeleport from "../SceneTeleport/PrevSceneTeleport";


const SceneEndingPage = ({ gameId, setScene }) => {


    return (
        <div className="ending_box">
            <div>
                    The End
            </div>
            <div className="ending_button_container">
                {/* <p>n개의 엔딩 중 1개를 발견하셨습니다. </p> */}
                {/* <p>이 씬으로 온 당신은 1 n</p> */}

                {/* <p>걸어왔던 길</p> -- 히스토리 맵 그 이상의.. 대사가 곁들여지고 멋진..*/}
                <React.Fragment>

                    <FirstSceneTeleport 
                        key={0}
                        gameId={gameId}
                        setScene = {setScene}
                    />
                    <PrevSceneTeleport 
                        key={1}
                        gameId={gameId}
                        setScene={setScene}
                    />
                </React.Fragment>
            </div>
        </div>
    )

}

export default SceneEndingPage;
