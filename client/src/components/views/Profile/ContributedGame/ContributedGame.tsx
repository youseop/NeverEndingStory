import { message } from 'antd';
import Axios from "axios";
import React, { useEffect, useState } from 'react';
import {LOCAL_HOST} from "../../../Config";
import { Link, useHistory } from "react-router-dom";

import './ContributedGame.css';

import { ObjectId } from "mongodb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFile, faHeart } from '@fortawesome/free-solid-svg-icons';
import { SCENE_ICON } from '../../../svg/icon';

interface ContributedGame {
  gameId: string;
  title: string;
  thumbnail: string;
  _id: string;
}

interface GameDetail {
  createdAt: string;
  description: string;
  sceneCnt: number;
  thumbnail: string;
  title: string;
}

interface ThumbsUp {
  like: number;
  isClick: boolean;
}

function ContributedGame(props: any) {
  const gameId: string = props.gameId;
  const sceneCnt: number = props.sceneCnt;

  const [gameDetail, setGameDetail] = useState<GameDetail>({
    createdAt: "",
    description: "",
    sceneCnt: 0,
    thumbnail: "",
    title: "",
  });
  const [view, setView] = useState<number>(0);
  const [thumbsUp, setThumbsUp] = useState<ThumbsUp>({
    like: 0,
    isClick: false,
  });
  
  useEffect(() => {
    Axios.post("/api/game/getgamedetail", {gameId: new ObjectId(gameId)}).then((response) => {
      setGameDetail(response.data.gameDetail)
    })
    Axios.post("/api/view/", {objectId: new ObjectId(gameId)}).then((response) => {
      setView(response.data.view)
    })
    Axios.post("/api/thumbsup/count", {objectId: new ObjectId(gameId)}).then((response) => {
      setThumbsUp({
        isClick: response.data.isClicked,
        like: response.data.thumbsup
      });
    })
  },[])

  if(gameDetail?.title === ""){
    return <div></div>
  }

  const description = gameDetail.description.length > 300 ? gameDetail.description.slice(0,300)+'...' : gameDetail.description;
  return (
    <div className="contribute__container">
      <Link to={`/game/${gameId}`}>
        <img
          className="contribute__img"
          src={`http://${LOCAL_HOST}:5000/${gameDetail.thumbnail}`}
          alt="https://cdn.crowdpic.net/list-thumb/thumb_l_110F2464CA8958D839ECCBA33E453FDF.jpg"
        />
        <div className="contribute__icon">
          <div>
            {gameDetail.sceneCnt}
            <FontAwesomeIcon icon={faFile} style={{ marginLeft: "10px" }} /> 
          </div>
          <div>
            {view}
            <FontAwesomeIcon icon={faEye} style={{ marginLeft: "10px" }} />
          </div>
          <div>
            {thumbsUp.like} 
            <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faHeart} />
          </div>
        </div>
      </Link>
      <div className="contribute__info">
        <div className="contribute__title">{gameDetail.title}</div>
        <div className="contribute__text">{description}</div>
        {sceneCnt >= 0 ?
          <div className="contribute__contributeCntText">
            기여한 스토리 개수: 
            <div className="contribute__cnt">
              {sceneCnt}
            </div>
          </div>
          :
          <div></div>
        }
      </div>
    </div>
  )
}
export default ContributedGame
