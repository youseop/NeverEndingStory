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

    const uploadGameFrame = async () => {
        // console.log(props)

              // tmp scene create
        const gameResponse = await Axios.get("/api/game/uploadgameframe")

        if (!gameResponse.data.success) {
            alert("game Frame제작 실패");
            return;
        }

        const firstScene = {
            gameId: gameResponse.data.game._id,
            prevSceneId: null,
            sceneDepth: 0,
            isFirst : 1,
            title: ""
            };

    
        const sceneResponse = await Axios.post("/api/scene/create", firstScene)
        if (!sceneResponse.data.success) {
            alert("scene Frame제작 실패");
            return;
        }

        message.success(
            "첫 Scene을 생성해주세요. 오른쪽의 버튼을 활용해 이미지들을 추가할 수 있습니다."
        );
        setTimeout(() => {
            props.history.replace({
                pathname: `/scene/make`,
                state: {
                  gameId: gameResponse.data.game._id,
                  sceneId: sceneResponse.data.sceneId
                }
              });
        }, 1000);
        

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
