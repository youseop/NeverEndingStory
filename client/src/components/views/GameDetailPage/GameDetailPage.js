import { Button, message } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GameDetailPage.css";
import { LOCAL_HOST } from "../../Config"
import Comment from '../Comment/Comment.js';
import { socket } from "../../App";
import { SVG } from "../../svg/icon";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import TopRatingContributer from "./TopRatingContributer";

const config = require('../../../config/key')

function GameDetailPage(props) {
    const gameId = props.match.params.gameId;
    const variable = { gameId: gameId };

    const [gameDetail, setGameDetail] = useState([]);
    const [sceneId, setSceneId] = useState([]);
    const [isMaking, setIsMaking] = useState(false);
    const [view, setView] = useState(0);
    const [thumbsUp, setThumbsUp] = useState(0);
    const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
    const [totalSceneCnt, setTotalSceneCnt] = useState(0);
    const [ContributerCnt, setContributerCnt] = useState(0);
    const [contributerList, setContributerList] = useState([]);

    const user = useSelector((state) => state.user);

    const playFirstScene = async (isFirst) => {
        try {
            const response = isFirst && await Axios.get("/api/users/playing-list/clear");
            props.history.replace({
                pathname: (!isFirst && isMaking) ? `/scene/make` : `/gameplay`,
                state: {
                    sceneId: isFirst ? response.data.teleportSceneId : sceneId,
                    gameId: gameId,
                }
            })
        } catch (err) {
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
        if (user && user.userData) {
            const variable = {
                userId: user.userData._id,
                objectId: gameId
            }
            Axios.post("/api/view/", variable).then((response) => {
                if (response.data.success) {
                    setView(response.data.view);
                }
            })
        }
    }, [user])

    useEffect(() => {
        if (user && user.userData) {
            const variable = {
                objectId: gameId,
                userId: user.userData._id,
            }
            Axios.post("/api/thumbsup/count", variable).then((response) => {
                if (response.data.success) {
                    setThumbsUp(response.data.thumbsup);
                    setThumbsUpClicked(response.data.isClicked);
                }
            })
        }
    }, [user])

    function onClick_thumbsUp() {
        if (user && user.userData) {
            // ((state) => state+1);
            const variable = {
                userId: user.userData._id,
                objectId: gameId
            }
            Axios.post("/api/thumbsup/", variable).then((response) => {
                if (response.data.success) {
                    setThumbsUp(response.data.thumbsup);
                    setThumbsUpClicked(response.data.isClicked);
                }
            })
        }
    }

    return (
        <div className="detailPage__container">

            {/* 이미지 불러오는게 늦음 디버깅 필요 */}
            <div className="detailPage__thumbnail_container">
                <img
                    className="detailPage__thumbnail"
                    src={
                        process.env.NODE_ENV === 'production' ?
                            gameDetail.thumbnail
                            :
                            `${config.SERVER}/${gameDetail?.thumbnail}`}
                    alt="thumbnail"
                />
                <div className="detailPage__contributer_container">
                    <div className="detailPage__contributer_title"> {ContributerCnt}명이 함께하는 이야기</div>
                    <TopRatingContributer
                        contributerList={contributerList}
                        creatorNickname={gameDetail?.creator?.nickname}
                        totalSceneCnt={totalSceneCnt}
                    />
                </div>
                <div className="detailPage__gamePlay">
                    <div className="detailPage__gamePlay_container">
                        <div className="detailPage__gamePlay_text">
                            현재 스토리
                        </div>
                        <div className="detailPage__gamePlay_sceneCntContainer">
                            <div className="detailPage__gamePlay_sceneCnt">
                                {totalSceneCnt}
                            </div>
                            <div className="detailPage__gamePlay_cntText">
                                개
                            </div>
                        </div>
                    </div>

                    <Link
                        className="detailPage__gamePlay_link"
                        style={{ color: "#f05454" }}
                        to={
                            {
                                pathname: isMaking ? `/scene/make` : `/gameplay`,
                                state: {
                                    gameId: gameId,
                                    sceneId: sceneId
                                },
                            }
                        }>
                        <div className="icon">
                            <SVG
                                src="playIcon_1"
                                width="30"
                                height="30"
                                color="#FFF"
                            />
                        </div>
                        <div className="text">시작하기</div>
                    </Link>
                    {/* 게임 시작하기 or 이어 만들기 */}
                    {/* <Button onClick={() => playFirstScene(true)}>
                        처음부터 하기
            </Button>
                    <Button onClick={() => playFirstScene(false)}>
                        게임 이어하기
            </Button> */}
                </div>
                <div className="detailPage__gradation"></div>
                <div className="detailPage__UPTitle">
                    {gameDetail.title}
                </div>
                <div className="detailPage__interaction">
                    <div
                        onClick={onClick_thumbsUp}
                        className="detailPage__like"
                    >
                        {thumbsUp}
                        {thumbsUpClicked ?
                            <FontAwesomeIcon style={{ color: "red", marginLeft: "10px" }} icon={faHeart} />
                            :
                            <FontAwesomeIcon icon={faHeart} style={{ marginLeft: "10px" }} />
                        }
                    </div>
                    <div className="detailPage__view">
                        {view}
                        <FontAwesomeIcon icon={faEye} style={{ marginLeft: "10px" }} />
                    </div>
                </div>
            </div>
            <div className="detailPage__info_container">
                <div className="detailPage__title">
                    {/* {gameDetail.title} */}

                </div>
                <div className="detailPage__genre">
                    장르:
                    <div className="bold_text">
                        {gameDetail.category}
                    </div>
                    작가:
                    <div className="bold_text">
                        {gameDetail?.creator?.nickname.substr(0, 20)}
                    </div>
                </div>
                <div className="detailPage__description">
                    {gameDetail.description}
                </div>

                <Comment gameId={gameId} />
            </div>
        </div>
    );
}

export default GameDetailPage;
