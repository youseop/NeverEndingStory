import { message } from 'antd';
import Axios from "axios";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import {LOCAL_HOST} from "../../Config";
import ContributedGame from './ContributedGame/ContributedGame';

import './Profile.css';

interface Game {
  gameId: string;
  sceneId: string;
}

interface SceneInfo {
  sceneId: string;
  depth: number;
}

interface ContributedScene_type {
  sceneCnt: number;
  gameId: string;
  title: string;
  thumbnail: string;
  sceneList: SceneInfo[];
}

interface ContributedGame_type {
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
  contributedSceneList: ContributedScene_type[];
  contributedGameList: ContributedGame_type[];
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
  const FETCHNIG_CNT: number = 5;

  const [user, setUser] = useState<UserData>({
    makingGameList: [],
    image: "",
    email: "",
    nickname: "",
    _id: "",
    contributedSceneList: [],
    contributedGameList: [],
  });
  const [fetching, setFetching] = useState(false);
  const [gameContentsNumber, setGameContentsNumber] = useState<number>(FETCHNIG_CNT);
  const [sceneContentsNumber, setSceneContentsNumber] = useState<number>(FETCHNIG_CNT);
  const [totalSceneContribute, setTotalSceneContribute] = useState<number>(0);
  const [totalGameContribute, setTotalGameContribute] = useState<number>(0);

  useEffect(() => {
    Axios.post("/api/users/profile", {userId: userId}).then((response) => {
      if (response.data.success) {
        setUser(response.data.user);
        let tmp: number = 0;
        for (let i=0; i<response.data.user.contributedSceneList.length; i++){
          tmp += response.data.user.contributedSceneList[i].sceneCnt;
        }
        setTotalSceneContribute(tmp);
        setTotalGameContribute(response.data.user.contributedGameList.length);
      } else {
          message.error("사용자 정보를 불러오는데 실패했습니다.");
      }
    })
  },[])
  
  if(currUserData?._id === userId){
    isUser = true;
  }

  const displayContributedScene = (user: UserData) => {
    const contributedSceneList: ContributedScene_type[] = user.contributedSceneList.slice(0,sceneContentsNumber);
    if(contributedSceneList){
      const contributedScene =  contributedSceneList.map((
        game: ContributedScene_type
      ) => {
        return (
          <div key={game.gameId}>
            <ContributedGame 
              gameId={game.gameId}
              sceneCnt={game.sceneCnt}
            />
          </div>
        )
      })
      return (
        <>
        {contributedScene}
        {user.contributedSceneList.length > sceneContentsNumber?
          <div
            className="displayMore" 
            onClick={()=>setSceneContentsNumber((state)=>state+FETCHNIG_CNT)}
          >
            더보기
          </div>
          :
          <div></div>
        }
        </>
      )
    }
  }

  const displayContributedGame = (user: UserData) => {
    const contributedGameList: ContributedGame_type[] = user.contributedGameList.slice(0,gameContentsNumber);;
    if(contributedGameList){
      const contributedGame =  contributedGameList.map((
        game: ContributedGame_type
      ) => {
        return (
          <div key={game.gameId}>
            <ContributedGame 
              gameId={game.gameId}
              sceneCnt={-1}
            />
          </div>
        )
      })
      return (
        <>
        {contributedGame}
        {user.contributedGameList.length > gameContentsNumber?
          <div
            className="displayMore" 
            onClick={()=>setGameContentsNumber((state)=>state+FETCHNIG_CNT)}
          >
            더보기
          </div>
          :
          <div></div>
        }
        </>
      )
    }
  }

  // const displayMakingGame = (currUserData: UserData) => {
  //   const makingGameList: Game[] = currUserData.makingGameList;
  //   if (makingGameList){
  //     return makingGameList.map((game: Game, index: number) => {
  //       return (
  //         <div key={index}>
  //           <div>
  //             {game.gameId}
  //           </div>
  //           <Link to={
  //             {
  //               pathname: `/scene/make`,
  //               state: {
  //                 gameId: game.gameId,
  //                 sceneId: game.sceneId
  //               }
  //             }
  //           } key = {index}>
  //             게임 만들러가기..
  //           </Link>
  //         </div>
  //       )
  //     })
  //   } else{
  //     return <div>만드는 중인 게임이 없습니다..</div>
  //   }
  // }

  const onClick_tab = (name: string): void => {
    const element: HTMLElement | null = document.getElementById(name);
    document.getElementById("contributedGame")!.style.display = "none";
    document.getElementById("contributedScene")!.style.display = "none";
    // if(isUser)
    //   document.getElementById("makingGame")!.style.display = "none";
    element!.style.display = "block";
  }

  if (currUserData){
    return (
      <div className="profile__container">
        
        <div className="profile__thumbnail_container">
          <img
              className="profile__thumbnail"
              src={`https://i.imgur.com/UwPKBqQ.jpg`}
              alt=""
          />
          <div className="profile__gradation"></div>
          <div className="profile__userInfo">
            <img 
              src={user.image} alt="" 
              className="profile__img"
            />
            <div className="profile__text">
              <div>{user.nickname}</div>
              <div>{user.email}</div>
            </div>
        </div>
        </div>
        
        <div className="profile__btn_container">
          <div 
            className="profile__btn"
            onClick={() => onClick_tab("contributedScene")}
          >
            내가 만든 스토리 
          </div>
          <div 
            className="profile__btn"
            onClick={() => onClick_tab("contributedGame")}
          >
            내가 만든 게임 
          </div>
          
          {/* {isUser &&
          <div onClick={() => onClick_tab("makingGame")}>만들던 게임</div>
          } */}
        </div>
        <div 
          id="contributedScene"
          style={{display:"block"}}
        >
          <div className="profile__title">
            기여한 스토리 {totalSceneContribute} 개
          </div>
          {displayContributedScene(user)}
        </div>
        <div 
          id="contributedGame"
          style={{display:"none"}}
        >
          <div className="profile__title">
            기여한 게임 {totalGameContribute} 개
          </div>
          {displayContributedGame(user)}
        </div>
        
        {/* {isUser &&
        <div 
          id="makingGame"
          style={{display:"none"}}
        >
          만들던 게임
          {displayMakingGame(currUserData)}
        </div>
        }
        {isUser ? 
        <div>isuser</div>
        :
        <div>isnt user</div>
        } */}
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
