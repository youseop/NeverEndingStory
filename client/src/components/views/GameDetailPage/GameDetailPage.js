import { Button, message } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GameDetailPage.css";
import { LOCAL_HOST } from "../../Config"
import Comment from '../Comment/Comment.js';
import { socket } from "../../App";
import { useSelector } from "react-redux";

const config = require('../../../config/key')

function GameDetailPage(props) {
    const gameId = props.match.params.gameId;
    const variable = { gameId: gameId };

    const [gameDetail, setGameDetail] = useState([]);
    const [sceneId, setSceneId] = useState([]);
    const [isMaking, setIsMaking] = useState(false);
    const [update, setUpdate] = useState(false);
    const [view, setView] = useState(0);
    const [thumbsUp, setThumbsUp] = useState(0);
    const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
    const [totalSceneCnt, setTotalSceneCnt] = useState(0);
    const [ContributerCnt, setContributerCnt] = useState(0);
    const [contributerList, setContributerList] = useState([]);

    const user = useSelector((state) => state.user);

    const playFirstScene = async (isFirst) => {
        console.log(sceneId)
        try {     
            const response = isFirst && await Axios.get("/api/users/playing-list/clear");
            props.history.replace({
                pathname: (!isFirst && isMaking) ? `/scene/make` : `/gameplay`,
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
            }
        });
        Axios.post("/api/game/rank", variable).then((response) => {
            if (response.data.success) {
                setContributerList(response.data.topRank);
                setContributerCnt(response.data.contributerCnt);
                setTotalSceneCnt(response.data.totalSceneCnt);
            } else {
                message.error("게임 정보를 로딩하는데 실패했습니다.");
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

    useEffect(() => {
        if(user && user.userData){
            const variable = {
                userId: user.userData._id,
                objectId: gameId
            }
            Axios.post("/api/view/", variable).then((response) =>{
                if (response.data.success){
                    setView(response.data.view);
                }
            })
        }
    },[user])

    useEffect(() => {
        if(user && user.userData){
            const variable = {
                objectId: gameId,
                userId: user.userData._id,
            }
            Axios.post("/api/thumbsup/count", variable).then((response) =>{
                if (response.data.success){
                    setThumbsUp(response.data.thumbsup);
                    setThumbsUpClicked(response.data.isClicked);
                }
            })
        }
    },[update,user])

    function onClick_thumbsUp () {
        if(user && user.userData){
            // setUpdate((state) => state+1);
            const variable = {
                userId: user.userData._id,
                objectId: gameId
            }
            Axios.post("/api/thumbsup/", variable).then((response) =>{
                if (response.data.success){
                    setThumbsUp(response.data.thumbsup);
                }
            })
        }
    }

    const topContributer = contributerList.map((contributer, index) => {
        return (
            <div key={contributer.userId}>
                <div>{index+1}위</div>
                <img src={contributer.image} alt=""/>
                <div>{contributer.nickname}</div>
                <div>{contributer.email}</div>
                <div>만든 신 개수{contributer.userSceneCnt}</div>
            </div>
        )
    })

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
            <div>크리에이터: {gameDetail?.creator?.nickname}</div>
            <div>조회수: {view}</div>
            <div onClick={onClick_thumbsUp}>좋아요: {thumbsUp}</div>
            <div>상세 설명: {gameDetail.description}</div>
            <div>기여한 사람수: {ContributerCnt}</div>
            <div>씬 총 개수: {totalSceneCnt}</div>
            <div>{topContributer}</div>
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
