/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu, message } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "axios";

function RightMenu(props) {
    const user = useSelector((state) => state.user);

    const logoutHandler = () => {
        axios.get(`${USER_SERVER}/logout`).then((response) => {
            if (response.status === 200) {
                props.history.push("/login");
            } else {
                alert("Log Out Failed");
            }
        });
    };

    const uploadGameFrame = () => {
        Axios.get("/api/game/uploadgameframe").then((response) => {
            if (response.data.success) {
                message.success(
                    "첫 Scene을 생성해주세요. 오른쪽의 버튼을 활용해 이미지들을 추가할 수 있습니다."
                );
                setTimeout(() => {
                    props.history.push(
                        `/scene/make/${response.data.game._id}`
                    );
                }, 1000);
            } else {
                alert("game Frame제작 실패");
            }
        });
    }

    if (user.userData && !user.userData.isAuth) {
        return (
            <Menu mode={props.mode}>
                <Menu.Item key="mail">
                    <a href="/login">Signin</a>
                </Menu.Item>
                <Menu.Item key="app">
                    <a href="/register">Signup</a>
                </Menu.Item>
            </Menu>
        );
    } else {
        return (
            <Menu mode={props.mode}>
                <Menu.Item key="upload">
                    <a onClick={uploadGameFrame}>Game Upload</a>
                    {/* <a href="/game/upload">Game Upload</a> */}
                </Menu.Item>
                <Menu.Item key="profile">
                    <a href="/profile">Profile</a>
                </Menu.Item>
                <Menu.Item key="logout">
                    <a onClick={logoutHandler}>Logout</a>
                </Menu.Item>
            </Menu>
        );
    }
}

export default withRouter(RightMenu);
