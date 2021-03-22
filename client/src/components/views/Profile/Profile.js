import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import './Profile.css';


function Profile() {
  const userData = useSelector((state) => state.user.userData);
  console.log(userData);
  if (userData) {

    const list = (userData) => {
      const makingGameList = userData.makingGameList;
      return makingGameList.map((game) => {
        return (
          <>
            <div>
              {game.gameId}
            </div>
            <Link to={`/scene/make/${game.gameId}/${game.sceneId}`}>
              게임 만들러가기..
            </Link>
          </>
        )
      })
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
