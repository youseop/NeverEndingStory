import { message } from "antd";
import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Comment from '../Comment/Comment.js';
import { socket } from "../../App";
import { SVG } from "../../svg/icon";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faLink } from "@fortawesome/free-solid-svg-icons";
import TopRatingContributer from "./TopRatingContributer";
import { Modal } from "antd";

import "./GameDetailPage.css";
import { Link } from "react-router-dom";
import qs from "qs";
import GameForkButton from "./GameForkButton.js";
import { pasteLink } from "../../functions/pasteLink.js";

const config = require('../../../config/key')

export default function GameDetailPage(props) {
    const query = qs.parse(props.location?.search, { ignoreQueryPrefix: true });
    const gameId = props.match.params.gameId;
    const variable = { gameId: gameId };
    message.config({ maxCount: 2 })

    const [isWarningVisible, setIsWarningVisible] = useState(false)
    const [gameDetail, setGameDetail] = useState({});
    const [sceneId, setSceneId] = useState(null);
    const [isMaking, setIsMaking] = useState(false);
    const [view, setView] = useState(0);
    const [thumbsUp, setThumbsUp] = useState(0);
    const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
    const [totalSceneCnt, setTotalSceneCnt] = useState(0);
    const [ContributerCnt, setContributerCnt] = useState(0);
    const [contributerList, setContributerList] = useState([]);
    const [isPlayed, setIsPlayed] = useState(false);

    const user = useSelector((state) => state.user);

    const playFirstScene = async (isFirst, isInvitation) => {
        try {
            let response;
            let nowIsMaking;
            if (isFirst) {
                response = await Axios.post("/api/users/playing-list/clear", { gameId, sceneId });
                // Not Yet Tested
                if (response.data.success) {
                    nowIsMaking = response.data.nowIsMaking
                    if (user.userData.isAuth && nowIsMaking) {
                        socket.emit("empty_num_increase", { user_id: user.userData._id.toString(), scene_id: response.data.prevOfLastScene.toString() });
                    }
                    else if (response.data.refresh) {
                        message.error("다른 스토리 감상 시도를 감지하였습니다. 다시 시도해주세요.")
                        window.location.reload();
                        return;
                    }
                }
            }
            props.history.replace({
                pathname: (!isFirst && isMaking) ? `/scene/make` : `/gameplay${isInvitation ? "/full" : ""}`,
                state: {
                    sceneId: isFirst ? response.data.teleportSceneId : sceneId,
                    gameId: gameId,
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const updateFlag = useRef(true);

    useEffect(() => {
        if (user && user.userData && updateFlag.current) {
            updateFlag.current = false;
            Axios.get(`/api/game/start/${gameId}`).then((response) => {
                const { success, sceneId, isMaking, isPlayed } = response.data;
                if (success) {
                    setSceneId(sceneId);
                    setIsMaking(isMaking);
                    setIsPlayed(isPlayed);
                } else {
                    message.error("로그인 해주세요.");
                }
            });

            const userId = user.userData._id;
            Axios.get(`/api/detailpage/${gameId}/${userId}`).then((response) => {
                if (response.data.success) {
                    const {
                        topRank,
                        contributerCnt,
                        totalSceneCnt,
                        gameDetail,
                        isClicked,
                        thumbsup,
                        view
                    } = response.data;
                    setThumbsUp(thumbsup);
                    setThumbsUpClicked(isClicked);
                    setGameDetail(gameDetail);
                    setView(view);
                    setContributerList(topRank);
                    setContributerCnt(contributerCnt);
                    setTotalSceneCnt(totalSceneCnt);
                }
            })
        }
    }, [user])

    function onClick_thumbsUp() {
        if (user?.userData?.isAuth) {
            const variable = {
                userId: user.userData._id,
                objectId: gameId,
                flag: "1"
            }
            setThumbsUp((state) => {
                if (thumbsUpClicked) {
                    return state - 1;
                }
                return state + 1;
            });
            setThumbsUpClicked((state) => !state);
            Axios.post("/api/thumbsup/", variable);
        }
        else {
            message.error("로그인이 필요합니다.")
        }
    }

    if (totalSceneCnt) {
        return (
            <div className="detailPage__container">
                <div className="detailPage__thumbnail_container">
                    <img
                        className="detailPage__thumbnail"
                        src={
                            process.env.NODE_ENV === 'production' ?
                                gameDetail?.thumbnail
                                :
                                `${config.SERVER}/${gameDetail?.thumbnail}`}
                        alt="thumbnail"
                    />
                    <div className="detailPage__gradation"></div>
                </div>
                <div className="detailPage__gamePlay">

                    <div className="detailPage__UPTitle">
                        {gameDetail?.title}
                        <div className="detailPage__genre">
                            <div style={{ "display": "block" }}>
                                작가:&nbsp;
                                    <Link
                                    to={`/profile/${gameDetail?.creator?._id}`}
                                    className="bold_text"
                                >
                                    {gameDetail?.creator?.nickname?.substr(0, 20)}
                                </Link>&nbsp;&nbsp;

                            </div>
                            <div style={{ "display": "block" }}>
                                장르:&nbsp;{gameDetail?.category}&nbsp;
                            </div>
                        </div>
                        <div
                            className="detailPage__gamePlay_link"
                            onClick={() => playFirstScene(false)}
                        >
                            <div className="icon">
                                <SVG
                                    src="playIcon_1"
                                    width="30"
                                    height="30"
                                    color="#FFF"
                                />
                            </div>
                            {isPlayed ? (isMaking ? "계속 제작하기" : "이어하기") : "시작하기"}
                        </div>
                        {isPlayed &&
                            <>
                                <div
                                    className="detailPage__gamePlayFromStart_link"
                                    onClick={() => isMaking ? setIsWarningVisible(true) : playFirstScene(true)}
                                >
                                    처음부터 하기
                            </div>
                                <Modal
                                    visible={isWarningVisible}
                                    onOk={() => playFirstScene(true)}
                                    onCancel={() => setIsWarningVisible(false)}
                                    maskClosable={false}
                                    closable={false}
                                    centered={true}
                                    width={650}
                                    bodyStyle={{
                                        height: "170px",
                                        display: "flex",
                                    }}
                                    okText="확인"
                                    cancelText="취소"
                                >
                                    <div className="ending_modal_warning_sign"><svg color="#faad14" viewBox="64 64 896 896" focusable="false" className="" data-icon="exclamation-circle" width="20px" height="20px" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path></svg></div>
                                    <div className="ending_modal_warning_textarea">
                                        <h2>주의!</h2>
                                        <br></br>
                                        <h3>제작 중인 이야기가 삭제됩니다.</h3>
                                        <h3>제작 중에도 앞 이야기를 확인할 수 있는 서비스가 준비중입니다...</h3>
                                    </div>
                                </Modal>
                            </>
                        }
                    </div>
                    <div className="detailPage__contributer_container_box">
                        <div className="detailPage__contributer_container_box fit">
                            <div className="detailPage__contributer_container">
                                <div className="detailPage__contributer_title"> 가장 많은 기여를 한 사람</div>
                                <TopRatingContributer
                                    contributerList={contributerList}
                                    creatorNickname={gameDetail?.creator?.nickname}
                                    totalSceneCnt={totalSceneCnt}
                                />
                            </div>
                            <div className="detailPage__gamePlay_container_box">
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
                                <h1 style={{ "color": "white", "fontSize": "50px" }}>|</h1>
                                <div className="detailPage__gamePlay_container">
                                    <div className="detailPage__gamePlay_text">
                                        현재 기여자
                            </div>
                                    <div className="detailPage__gamePlay_sceneCntContainer">
                                        <div className="detailPage__gamePlay_sceneCnt">
                                            {ContributerCnt}
                                        </div>
                                        <div className="detailPage__gamePlay_cntText">
                                            명
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detailPage__info_container">
                    <div className="detailPage__info_bar">
                        {gameDetail?.creator?._id?.toString() === user?.userData?._id &&
                            <Link
                                to={`/admin/${gameId}`}
                                className="admin_btn"
                            >
                                스토리 미니맵
                        </Link>
                        }
                        <div className="detailPage__interaction">
                            <div className="detailPage__view">
                                <FontAwesomeIcon icon={faEye} style={{ marginLeft: "3px" }} />
                                {view}회
                            </div>
                            <div
                                onClick={onClick_thumbsUp}
                                className="detailPage__like"
                            >
                                {thumbsUpClicked ?
                                    <FontAwesomeIcon style={{ color: "red", marginLeft: "3px" }} icon={faHeart} />
                                    :
                                    <FontAwesomeIcon icon={faHeart} style={{ marginLeft: "3px" }} />
                                }
                                {thumbsUp}개
                            </div>
                            <div
                                className="link_bttn"
                                onClick={(e) => {
                                    pasteLink(gameId);
                                }}>
                                <FontAwesomeIcon
                                    icon={faLink}
                                />
                            초대링크복사&nbsp;
                            </div>
                            <GameForkButton
                                history={props.history}
                                user={user}
                                gameId={gameId}
                            />
                        </div>

                    </div>
                    <div className="detailPage__description">
                        {gameDetail?.description}
                    </div>

                    <Comment gameId={gameId} />
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="loader_container">
                <div className="loader" />
            </div>
        )
    }
}
