import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import './Profile.css';

interface Game {
  gameId: string;
  sceneId: string;
}

interface UserData {
  makingGameList: Game[];
  image: string;
  email: string;
  nickname: string;
}

interface State_user {
  user: {
    userData: UserData;
  }
}

function Profile() {
  const userData: UserData = useSelector((state: State_user) => state.user.userData);
  if (userData) {
    const list = (userData: UserData) => {
      const makingGameList: Game[] = userData.makingGameList;
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
        return <div></div>
      }
    }
    return (
      <div>
        <img src={userData.image} alt="" />
        <div>{userData.email}</div>
        <div>{userData.nickname}</div>
        {list(userData)}
        {/* <div>{userData.makingGameList[0]}</div> */}
      </div>
    )
  } else {
    return (
      <div>
        loading...
      </div>
    )
  }
}

export default Profile
