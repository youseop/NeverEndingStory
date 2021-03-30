import { message } from 'antd';
import Axios from "axios";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import {LOCAL_HOST} from "../../Config";

import './Profile.css';

interface Game {
  gameId: string;
  sceneId: string;
}

interface SceneInfo {
  sceneId: string;
  depth: number;
}

interface ContributedScene {
  sceneCnt: number;
  gameId: string;
  title: string;
  thumbnail: string;
  sceneList: SceneInfo[];
}

interface ContributedGame {
  gameId: string;
  title: string;
  thumbnail: string;
}

interface UserData {
  makingGameList: Game[];
  image: string;
  email: string;
  nickname: string;
  _id: string;
  contributedSceneList: ContributedScene[];
  contributedGameList: ContributedGame[];
}

interface State_user {
  user: {
    userData: UserData;
  }
}

function Profile(props: any) {
  const userId: string = props.match.params.userId;
  const currUserData: UserData = useSelector((state: State_user) => state.user.userData);
  let isUser: boolean = false;

  const [user, setUser] = useState<UserData>({
    makingGameList: [],
    image: "",
    email: "",
    nickname: "",
    _id: "",
    contributedSceneList: [],
    contributedGameList: [],
  });

  useEffect(() => {
    Axios.post("/api/users/profile", {userId: userId}).then((response) => {
      if (response.data.success) {
        setUser(response.data.user);
      } else {
          message.error("사용자 정보를 불러오는데 실패했습니다.");
      }
    })
  },[])
  
  if(currUserData?._id === userId){
    isUser = true;
  }

  console.log(user)

  const displayContributedScene = () => {
    const contributedSceneList: ContributedScene[] = user.contributedSceneList;
    if(contributedSceneList){
      return contributedSceneList.map((
        game: ContributedScene, index: number
      ) => {
        return (
          <div key={index}>
            <a href={`/game/${game.gameId}`}>
              <img
                src={`http://${LOCAL_HOST}:5000/${game.thumbnail}`}
                alt={game.title}
              />
              <div>{game.title}</div>
              <div>{game.sceneCnt}</div>
            </a>
          </div>
        )
      })
    }
  }

  const displayContributedGame = () => {
    const contributedGameList: ContributedGame[] = user.contributedGameList;
    if(contributedGameList){
      return contributedGameList.map((
        game: ContributedGame, index: number
      ) => {
        return (
          <div key={index}>
            <a href={`/game/${game.gameId}`}>
              <img
                src={`http://${LOCAL_HOST}:5000/${game.thumbnail}`}
                alt={game.title}
              />
              <div>{game.title}</div>
            </a>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )
      })
    }
  }

  const displayMakingGame = (currUserData: UserData) => {
    const makingGameList: Game[] = currUserData.makingGameList;
    if (makingGameList){
      return makingGameList.map((game: Game, index: number) => {
        return (
          <div key={index}>
            <div>
              {game.gameId}
            </div>
            <Link to={
              {
                pathname: `/scene/make`,
                state: {
                  gameId: game.gameId,
                  sceneId: game.sceneId
                }
              }
            } key = {index}>
              게임 만들러가기..
            </Link>
          </div>
        )
      })
    } else{
      return <div>만드는 중인 게임이 없습니다..</div>
    }
  }

  if (currUserData){
    return (
      <div className="profile">
        <img src={currUserData.image} alt="" />
        <div>{currUserData.email}</div>
        <div>{currUserData.nickname}</div>
        <div>
          displayMAkingGame
          {displayMakingGame(currUserData)}
        </div>
        <div>
          displayContributedGame
          {displayContributedGame()}
        </div>
        <div>
          displayContributedScene
          {displayContributedScene()}
        </div>
        {isUser ? 
        <div>isuser</div>
        :
        <div>isnt user</div>
        }
      </div>
    )
  } else {
    return (
      <div>
        loading...
      </div>)
  }
}

export default Profile
