
import React, { useState } from "react";
import Axios from "axios"
import { message } from "antd";
import "antd/dist/antd.css";
import "./GameForkButton.css";
import { TitleModalForm } from "../Modal/TitleModalForm";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GameForkButton = ({ history, user, gameId }) => {
    const [category, setCategory] = useState("");
    const [visible, setVisible] = useState(false);
    const [gameTitle, setGameTitle] = useState("");
    const [gameDescription, setGameDescription] = useState("");
    message.config({ maxCount: 2 })

    const handleCreate = () => {
        if (!gameTitle.length) {
            message.error("제목을 입력해주세요.")
            return;
        }
        if (!gameDescription.length) {
            message.error("스토리 설명을 입력해주세요.")
            return;
        }

        forkGame()
    }
    const forkGame = async () => {
        if (user?.userData?.isAuth) {
            const variable = {
                userId: user.userData._id,
                parentGameId: gameId,
                title: gameTitle,
                description: gameDescription,
                category: category
            }

            const gameResponse = await Axios.post("/api/game/fork", variable)
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

            const sceneResponse = await Axios.post("/api/scene/create", firstScene);
            if (!sceneResponse.data.success) {
                alert("scene Frame제작 실패");
                return;
            }

            message.success(
                "이야기를 시작해주세요. 오른쪽의 버튼을 활용해 이미지들을 추가할 수 있습니다."
            );

            setTimeout(() => {
                history.replace({
                    pathname: `/scene/make`,
                    state: {
                        gameId: gameResponse.data.game._id,
                        sceneId: sceneResponse.data.sceneId,
                    },
                });
            }, 1000);
        }
        else {
            message.error("로그인이 필요합니다.",0.5)
        }
    }
    return (
        <div>
            {/* <div
                onClick={() => setVisible(true)}
                className="detailPage__fork_btn">
                버전 추가하기
            </div> */}
            <div
                className="link_bttn"
                onClick={() => setVisible(true)}
                >
                <FontAwesomeIcon
                    icon={faPlus}
                />버전 추가하기&nbsp;
            </div>
            <TitleModalForm
                visible={visible}
                type="fork"
                onCancel={() => setVisible(false)}
                onCreate={() => handleCreate()}
                setGameTitle={setGameTitle}
                setGameDescription={setGameDescription}
                setCategory={setCategory}
            />
        </div>
    )
}
export default GameForkButton;
