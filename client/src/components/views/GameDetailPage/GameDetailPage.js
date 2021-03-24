import { message } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GameDetailPage.css";
import { LOCAL_HOST } from"../../Config"
import Comment from '../Comment/Comment';
import useSound from 'use-sound'
import { socket } from "../../App";
import { replace } from "formik";

function GameDetailPage(props) {
    const gameId = props.match.params.gameId;
    const variable = { gameId: gameId };

    const [gameDetail, setGameDetail] = useState([]);
    const [sceneId, setSceneId] = useState([]);
    const [isMaking, setIsMaking] = useState(false);

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
                setIsMaking(response.data.isMaking);
            } else {
                message.error("로그인 해주세요.");
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
                    src={`http://${LOCAL_HOST}:5000/${gameDetail.thumbnail}`}
                    alt="thumbnail"
                />}
            <div>카테고리 : {gameDetail.category}</div>
            <div>크리에이터: {gameDetail.creator}</div>
            <div>{gameDetail.description}</div>
            <br />

            {/* 게임 시작하기 or 이어 만들기 */}
            <Link to={
                {
                    pathname: isMaking ? `/scene/make` : `/gameplay`,
                    state: {
                        gameId: gameId,
                        sceneId: sceneId
                    },
                }
                }>
                게임 시작하기
            </Link>
            <Comment gameId={gameId} />
        </div>
    );
}

export default GameDetailPage;
