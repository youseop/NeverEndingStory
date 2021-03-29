
import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "axios";
import { Button } from "antd";


const PrevSceneTeleport = ({ gameId }) => {
    const history = useHistory();
    const user = useSelector((state) => state.user);

    const playingListPop = () => {

        if (user) {
            //! auth를 통해서 쿠키에서 유저정보 갖고올 수 있다.
            Axios.get("/api/users/playing-list/pop").
                then(response => {
                    if (response.data.success) {

                        history.push({
                            pathname: `/gameplay`,
                            state: {
                                sceneId: response.data.teleportSceneId,
                                gameId: gameId,
                            }
                        })
                    }
                    else {
                        alert("오류가 발생했습니다.")
                    }
                })
        }
        else {
            alert("로그인 시 지원되는 기능입니다.")
        }

    }


    return (
        <Button
                onClick={playingListPop}
        >이전으로 돌아가기
        </Button>

    )

}


export default PrevSceneTeleport;
