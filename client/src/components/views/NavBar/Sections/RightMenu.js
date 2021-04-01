/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../../_actions/user_actions";

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        dispatch(logoutUser());
        props.history.push("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  if (
    !user.userData ||
    (user.loginSuccess && !user.userData._id) ||
    (!user.loginSuccess && user.userData._id)
  ) {
    return null;
  } else if (!user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="login">
          <Link to="/login">로그인</Link>
        </Menu.Item>
        <Menu.Item key="register">
          <Link to="/register">회원가입</Link>
        </Menu.Item>
      </Menu>
    );
  } else if (user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="profile">
          {user?.userData?._id ? (
            <Link to={`/profile/${user.userData._id}`}>프로필</Link>
          ) : (
            "프로필"
          )}
        </Menu.Item>
        <Menu.Item key="logout">
          <Link to="/" onClick={logoutHandler}>
            로그아웃
          </Link>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
