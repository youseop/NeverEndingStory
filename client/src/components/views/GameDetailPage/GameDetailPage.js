import { message } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GameDetailPage.css";
import Comment from '../Comment/Comment';

function GameDetailPage(props) {
    const gameId = props.match.params.gameId;
    const variable = { gameId: gameId };

    const [gameDetail, setGameDetail] = useState([]);
    const [sceneId, setSceneId] = useState([]);

    useEffect(() => {
        Axios.post("/api/game/getgamedetail", variable).then((response) => {
            if (response.data.success) {
                setGameDetail(response.data.gameDetail);
            } else {
                message.error("게임 정보를 로딩하는데 실패했습니다.");
                //Todo : 게임 정보를 로딩하는데 실패했습니다 메세지 변경하기(자세히)
            }
        });
    }, []);

    useEffect(() => {
    Axios.get(`/api/game/gamestart/${gameId}`).then((response) => {
            if (response.data.success) {
                setSceneId(response.data.sceneId);
            } else {
                message.error("게임 정보를 로딩하는데 실패했습니다.");
            }
        });
    }, []);

    return (
        <div className="detailPage__container">
            <h2>game detail page</h2>
            <h1>제목: {gameDetail.title}</h1>

            {/* 이미지 불러오는게 늦음 디버깅 필요 */}
            {gameDetail.thumbnail && 
            <img
                style={{ width: "30%", height: "30%" }}
                src={`http://localhost:5000/${gameDetail.thumbnail}`}
                alt="thumbnail"
            />}
            <div>카테고리 : {gameDetail.category}</div>
            <div>크리에이터: {gameDetail.creator}</div>
            <div>{gameDetail.description}</div>
            <br />
            <Link to={`/gameplay/${gameId}/${sceneId}`}>
                게임 시작하기..
            </Link>
            <Comment gameId={gameId}/>
        </div>
    );
}

export default GameDetailPage;
