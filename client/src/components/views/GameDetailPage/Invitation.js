import React from "react";
import dotenv from "dotenv";
import { SVG } from "../../svg/icon";
import './invitation.css'
const config = require('../../../config/key');
dotenv.config();

export const Invitaion = ({ gameDetail, playFirstScene }) => {
    return (
        <div className="invitation_container">
            <div className="invitation__thumbnail_container">
                <img
                    className="invitation__thumbnail"
                    src={
                        process.env.NODE_ENV === 'production' ?
                            gameDetail.thumbnail
                            :
                            `${config.SERVER}/${gameDetail?.thumbnail}`}
                    alt="thumbnail"
                />
                <div className="invitation__gamePlay">
                    <div className="invitation__UPTitle">
                        {gameDetail?.title}
                    </div>
                    <div className="invitation__genre">
                        장르: {gameDetail.category} &nbsp; 
                        작가: {gameDetail?.creator?.nickname.substr(0, 20)}
                    </div>
                    <div className="invitation__description">
                        {gameDetail.description}
                    </div>
                    <div
                        className="detailPage__gamePlay_link invitation"
                        onClick={() => playFirstScene(false, true)}
                    >
                        <div className="icon">
                            <SVG
                                src="playIcon_1"
                                width="30"
                                height="30"
                                color="#FFF"
                            />
                        </div>
                            시작하기
                        </div>
                </div>
            </div>
        </div>
    );
}