import React from 'react'
import "./LandingPage_buttons.css"
import Axios from "axios"
import { message } from "antd";

interface newGameButtonProps{
    replace : Function;
}

interface responseTypes{
    data: {
        game: {
            _id:string;
        }
        sceneId: string;
        success: boolean;
    };
}

export function NewGameButton({replace}:newGameButtonProps) {

    const uploadGameFrame = async () => {
        // tmp scene create
        const gameResponse : responseTypes = await Axios.get("/api/game/uploadgameframe");

        if (!gameResponse.data.success) {
            alert("game Frame제작 실패");
            return;
        }

        const firstScene = {
            gameId: gameResponse.data.game._id,
            prevSceneId: null,
            sceneDepth: 0,
            isFirst: 1,
            title: "",
        };

        const sceneResponse : responseTypes = await Axios.post("/api/scene/create", firstScene);
        if (!sceneResponse.data.success) {
            alert("scene Frame제작 실패");
            return;
        }

        message.success(
            "첫 Scene을 생성해주세요. 오른쪽의 버튼을 활용해 이미지들을 추가할 수 있습니다."
        );
        
        setTimeout(() => {

            replace({
                pathname: `/scene/make`,
                state: {
                    gameId: gameResponse.data.game._id,
                    sceneId: sceneResponse.data.sceneId,
                },
            });
        }, 1000);
    };

    return (
        <button className="button-newgame" onClick ={uploadGameFrame}>
            NEW 게임 만들기
        </button>
    )
}
