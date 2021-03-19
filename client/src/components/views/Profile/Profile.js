import React from 'react';
import { useSelector } from 'react-redux';
import './Profile.css';

function Profile() {
  const userData = useSelector((state) => state.user.userData);
  console.log(userData)
  if (userData) {
    return (
      <div>
        <img src={userData.image} alt=""/>
        <div>{userData.email}</div>
        <div>{userData.nickname}</div>
        <div>{userData.gameHistory}</div>
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
