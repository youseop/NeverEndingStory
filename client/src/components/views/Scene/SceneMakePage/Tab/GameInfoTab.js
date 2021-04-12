import React, { useEffect, useRef, useState } from "react";
import { SVG } from "../../../../svg/icon";
import TopRatingContributer from "../../../GameDetailPage/TopRatingContributer";
import { Link } from "react-router-dom";

const config = require('../../../../../config/key')
function GameInfoTab({ gameDetail, isMake }) {
    //! creator일때와 아닐 때 수정 가능하게 처리
    return (
        <div className="gameInfoTab__padding">
            <div className="gameInfoTab__container">
                <div className="gameInfoTab__thumbnail_container">
                    <img
                        className="gameInfoTab__thumbnail"
                        src={
                            process.env.NODE_ENV === 'production' ?
                                gameDetail?.thumbnail
                                :
                                `${config.SERVER}/${gameDetail?.thumbnail}`}
                        alt="thumbnail"
                    />
                    <div className="gameInfoTab__gradation"></div>
                </div>
                <div className="gameInfoTab__gamePlay">

                    <div className="gameInfoTab__UPTitle">
                        {gameDetail?.title}
                        <div className="gameInfoTab__genre">
                            <div style={{ "display": "block" }}>
                                작가:&nbsp;
                                    <Link
                                    to={`/profile/${gameDetail?.creator?._id}`}
                                    className="bold_text"
                                    target="_blank"
                                >
                                    {gameDetail?.creator?.nickname?.substr(0, 20)}
                                </Link>&nbsp;&nbsp;

                            </div>
                            <div style={{ "display": "block" }}>
                                장르:&nbsp;{gameDetail?.category}&nbsp;
                            </div>
                        </div>
                    </div>
                    <div className="gameInfoTab__contributer_container_box">
                        <div className="gameInfoTab__contributer_container_box fit">
                            <div className="gameInfoTab__contributer_container">
                                <div className="gameInfoTab__contributer_title"> 가장 많은 기여를 한 사람</div>
                                <TopRatingContributer
                                    contributerList={gameDetail?.contributerList}
                                    creatorNickname={gameDetail?.creator?.nickname}
                                    totalSceneCnt={gameDetail?.sceneCnt}
                                    isMake={isMake}
                                />
                            </div>
                            <div className="gameInfoTab__gamePlay_container_box">
                                <div className="gameInfoTab__gamePlay_container">
                                    <div className="gameInfoTab__gamePlay_text">
                                        현재 스토리
                                </div>
                                    <div className="gameInfoTab__gamePlay_sceneCntContainer">
                                        <div className="gameInfoTab__gamePlay_sceneCnt">
                                            {gameDetail?.sceneCnt}
                                        </div>
                                        <div className="gameInfoTab__gamePlay_cntText">
                                            개
                                    </div>
                                    </div>
                                </div>
                                <h1 className="gameInfoTab__gamePlay_bar">|</h1>
                                <div className="gameInfoTab__gamePlay_container">
                                    <div className="gameInfoTab__gamePlay_text">
                                        현재 기여자
                            </div>
                                    <div className="gameInfoTab__gamePlay_sceneCntContainer">
                                        <div className="gameInfoTab__gamePlay_sceneCnt">
                                            {gameDetail?.contributerList?.length}
                                        </div>
                                        <div className="gameInfoTab__gamePlay_cntText">
                                            명
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isMake > 0 &&
                    <div className="gameInfoTab__description_title">
                        게임 설명
                </div>
                }
                {isMake > 0 &&
                    <div className="gameInfoTab__description">
                        {gameDetail?.description}
                    </div>
                }
            </div>
        </div>
    );
}

export default GameInfoTab;
