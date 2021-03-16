import { Col, List, Row } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GameDetailPage.css";

function GameDetailPage(props) {
    const gameId = props.match.params.gameId;
    const variable = { gameId: gameId };

    const [gameDetail, setGameDetail] = useState([]);
    const [sceneId, setSceneId] = useState([]);

    useEffect(() => {
        Axios.post("/api/game/getgamedetail", variable).then((response) => {
            if (response.data.success) {
                // console.log(response.data.gameDetail);
                setGameDetail(response.data.gameDetail);
            } else {
                alert("게임 정보를 로딩하는데 실패했습니다.");
            }
        });
    }, []);
    useEffect(() => {
        Axios.get(`/api/game/gamestart/${gameId}`).then((response) => {
            // console.log(response.data.sceneId);
            if (response.data.success) {
                setSceneId(response.data.sceneId);
            } else {
                alert("게임 정보를 로딩하는데 실패했습니다.");
            }
        });
    }, []);

    //? gameDetail에 정보 담겨있습니다!

    return (
        <div>
            {/* console창 보시면 정보 받아지고 있습니다! (전부 다 보내진 않고 있음)
            정리해서 사용하세요. */}
            <h2>game detail page</h2>
            <h1>제목: {gameDetail.title}</h1>

            {/* 이미지 불러오는게 늦음 디버깅 필요 */}
            <img
                style={{ width: "30%", height: "30%" }}
                src={`http://localhost:5000/${gameDetail.thumbnail}`}
                alt="thumbnail"
            />
            <h3>ㅇ 카테고리 : {gameDetail.category}</h3>
            <h3>ㅇ 크리에이터: {gameDetail.creator}</h3>
            <h2>ㅇ 설명 ----------------</h2>
            <pre>{gameDetail.description}</pre>
            <h2>------------------------</h2>
            <br />
            <Link to={`/gameplay/${gameId}/${sceneId}`}>
                게임 시작하기.. <br />
            </Link>
        </div>
    );
}

export default GameDetailPage;
