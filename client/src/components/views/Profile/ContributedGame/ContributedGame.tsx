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
  first_scene: any;
}

function ContributedGame(props: any) {
  const gameId: string = props.gameId;
  const sceneCnt: number = props.sceneCnt;
  const userId: string = props.userId;

  const [gameDetail, setGameDetail] = useState<GameDetail>({
    createdAt: "",
    description: "",
    sceneCnt: 0,
    thumbnail: "",
    title: "",
    first_scene: null,
  });
  const [thumbsUp, setThumbsUp] = useState<number>(0);
  const [view, setView] = useState<number>(0);
  
  useEffect(() => {
    Axios.get(`/api/game/detail/${gameId}`).then((response) => {
      const gameDetail=response.data.gameDetail;
      setGameDetail(gameDetail);
      setView(gameDetail.view);
      setThumbsUp(gameDetail.thumbsUp);
    })
  },[])

  if(gameDetail?.title === ""){
    return <div></div>
  }

  const description = gameDetail.description.length > 300 ? gameDetail.description.slice(0,300)+'...' : gameDetail.description;

  if(!gameDetail?.first_scene) {
    return (
      <></>
    )
  } else {
    return (
      <div className="contribute__container">
        <Link to={`/game/${gameId}`}>
          <img
            className="contribute__img"
            src={process.env.NODE_ENV === "production" ?

            gameDetail.thumbnail
            :
            `http://${LOCAL_HOST}:5000/${gameDetail.thumbnail}`}
            
            alt="이미지를 찾을 수 없습니다."
            
            />
          <div className="contribute__icon">
            <div>
              {gameDetail.sceneCnt}
              <FontAwesomeIcon icon={faFile} className="specific_icon" /> 
            </div>
            <div>
              {view}
              <FontAwesomeIcon icon={faEye} className="specific_icon" />
            </div>
            <div>
              {thumbsUp} 
              <FontAwesomeIcon className="specific_icon" icon={faHeart} />
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
}
export default ContributedGame
