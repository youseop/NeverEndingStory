import React, { useState, useCallback } from "react";
import "./LandingPage_buttons.css"
import "antd/dist/antd.css";
import Axios from "axios"
import { message } from "antd";

const {TitleModalForm}: any = require("../Modal/TitleModalForm")
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

    const [visible, setVisible] = useState<any>(false);
    const [formRef, setFormRef] = useState<any>(null);
    // const [formRef, setFormRef] = useState<null | {validateFileds:any}></null>;



    const uploadGameFrame = async (title : String, description:any) => {
        // tmp scene create
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
    
    const handleCreate = () => {
        formRef?.validateFields((err: Error, values: {title : String, description : any}) => {
            if (err) {
                return;
            }

            uploadGameFrame(values.title, values.description);
            formRef?.resetFields();
            // setVisible(false);
        });

    }

    const saveFormRef = useCallback(node => {
        if (node !== null) {
            setFormRef(node);
        }
    }, []);


    return (
        <>
            {/* <button className="button-newgame" onClick ={uploadGameFrame}>
                NEW 게임 만들기
            </button> */}
            <button className="button-newgame" onClick={() => setVisible(true)}>
                NEW 게임 만들기
            </button>
        
            <TitleModalForm 
                ref={saveFormRef}
                visible={visible}
                onCancel={() => setVisible(false)}
                onCreate={() => handleCreate()}
            />
        </>
    )
}
