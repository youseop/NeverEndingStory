import { message } from 'antd';
import Axios from "axios";
import React, { useEffect, useState } from 'react';
import {LOCAL_HOST} from "../../../Config";
import { Link, useHistory } from "react-router-dom";

import './ContributedGame.css';

import { ObjectId } from "mongodb";

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

  if(gameDetail.title === ""){
    return <div></div>
  }
  return (
    <Link to={`/game/${gameId}`}>
      <img
        src={`http://${LOCAL_HOST}:5000/${gameDetail.thumbnail}`}
        alt="https://cdn.crowdpic.net/list-thumb/thumb_l_110F2464CA8958D839ECCBA33E453FDF.jpg"
      />
      <div>{gameDetail.title}</div>
      <div>신 개수: {gameDetail.sceneCnt}</div>
      <div>조회수 : {view}</div>
      <div>좋아요: {thumbsUp.like}</div>
      {sceneCnt >= 0 ?
        <div>기여한 씬 개수: {sceneCnt}/{gameDetail.sceneCnt}</div>
        :
        <div></div>
      }
      <div></div>
    </Link>
  )
}
export default ContributedGame
