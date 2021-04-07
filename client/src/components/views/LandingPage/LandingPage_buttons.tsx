import React, { useState, useCallback, useRef } from "react";
import { useSelector } from 'react-redux';
import "./LandingPage_buttons.css"
import "antd/dist/antd.css";
import Axios from "axios"
import { message } from "antd";

const { TitleModalForm }: any = require("../Modal/TitleModalForm")
interface newGameButtonProps {
    replace: Function;
}

interface responseTypes {
    data: {
        game: {
            _id: string;
        }
        sceneId: string;
        success: boolean;
    };
}

export function NewGameButton({ replace }: newGameButtonProps) {

    const [visible, setVisible] = useState<any>(false);
    const [gameTitle, setGameTitle] = useState<String>("");
    const [gameDescription, setGameDescription] = useState<String>("");
    const buttonFlag = useRef<boolean>(false)

    const user = useSelector<any, any>((state) => state.user);



    const uploadGameFrame = async (title : String, description:any) => {
        if(buttonFlag.current)
            return;
        // tmp scene create
        buttonFlag.current = true;
        const gameResponse : responseTypes = await Axios.post("/api/game/uploadgameframe", {title, description});

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

        const sceneResponse: responseTypes = await Axios.post("/api/scene/create", firstScene);
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

    const handleClick = () => {
        if (user.userData?.isAuth) {
            setVisible(true)
        }
        else {
            message.error("로그인이 필요합니다.")
        }
    }

    const handleCreate = () => {
        uploadGameFrame(gameTitle, gameDescription);
    }

    return (
        <>
            <button className="button-newgame" onClick={handleClick}>
                NEW 게임 만들기
            </button>

            <TitleModalForm
                visible={visible}
                onCancel={() => setVisible(false)}
                onCreate={() => handleCreate()}
                setGameTitle={setGameTitle}
                setGameDescription={setGameDescription}
            />
        </>
    )
}
