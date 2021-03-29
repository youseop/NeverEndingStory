import { Button, message } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GameDetailPage.css";
import { LOCAL_HOST } from "../../Config"
import Comment from '../Comment/Comment';
import { socket } from "../../App";

const config = require('../../../config/key')

function GameDetailPage(props) {
    const gameId = props.match.params.gameId;
    const variable = { gameId: gameId };

    const [gameDetail, setGameDetail] = useState([]);
    const [sceneId, setSceneId] = useState([]);
    const [isMaking, setIsMaking] = useState(false);

    const playFirstScene = async (isFirst) => {
        console.log(sceneId)
        try {     
            const response = isFirst && await Axios.get("/api/users/playing-list/clear");
            props.history.replace({
                pathname: isMaking ? `/scene/make` : `/gameplay`,
                state: {
                    sceneId: isFirst ? response.data.teleportSceneId : sceneId,
                    gameId: gameId,
                }
            })
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        Axios.post("/api/game/getgamedetail", variable).then((response) => {
            if (response.data.success) {
                setGameDetail(response.data.gameDetail);
            } else {
                message.error("게임 정보를 로딩하는데 실패했습니다.");
                //Todo : 게임 정보를 로딩하는데 실패했습니다 메세지 변경하기(자세히)
            }
        });

        Axios.get(`/api/game/gamestart/${gameId}`).then((response) => {
            if (response.data.success) {
                setSceneId(response.data.sceneId);
                setIsMaking(response.data.isMaking);
            } else {
                message.error("로그인 해주세요.");
            }
        });

    }, []);


    return (
        <div className="detailPage__container">

            {/* 이미지 불러오는게 늦음 디버깅 필요 */}
            {gameDetail.thumbnail &&
                <img
                    style={{ width: "30%", height: "30%" }}
                    src={
                        process.env.NODE_ENV === 'production' ?
                            gameDetail.thumbnail
                            :
                            `${config.SERVER}/${gameDetail.thumbnail}`}
                    alt="thumbnail"
                />}
            <div>제목: {gameDetail.title}</div>
            <div>카테고리 : {gameDetail.category}</div>
            <div>크리에이터: {gameDetail.creator}</div>
            <div>{gameDetail.description}</div>
            <br />

            {/* 게임 시작하기 or 이어 만들기 */}
            <Button onClick={() => playFirstScene(true)}>
                처음부터 하기
            </Button>
            <Button onClick={() => playFirstScene(false)}>
                게임 이어하기
            </Button>
            <Comment gameId={gameId} />
        </div>
    );
}

export default GameDetailPage;
