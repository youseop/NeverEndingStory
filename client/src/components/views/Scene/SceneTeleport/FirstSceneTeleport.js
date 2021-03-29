
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "axios";
import { Button, Modal } from "antd";

import "../SceneEndingPage/SceneEndingPage.css";



const FirstSceneTeleport = ({ gameId }) => {
    const history = useHistory();
    const user = useSelector((state) => state.user);
    const [isWarningVisible, setIsWarningVisible] = useState(false)

    const playingListClear = () => {

        if (user) {
            //! auth를 통해서 쿠키에서 유저정보 갖고올 수 있다.
            Axios.get("/api/users/playing-list/clear").
                then(response => {
                    if (response.data.success) {
                        setIsWarningVisible(false)
                        history.push({
                            pathname: `/gameplay`,
                            state: {
                                sceneId: response.data.teleportSceneId,
                                gameId: gameId,
                            }
                        })
                    }
                    else {
                        setIsWarningVisible(false)

                        alert("오류가 발생했습니다.")
                    }
                })
        }


    }
    const cancelModal = () => {
        setIsWarningVisible(false)
    }
    const openModal = () => {
        setIsWarningVisible(true)
    }
    return (
        <React.Fragment>
            <Button
                onClick={openModal}
                className="ending_button"
            >처음으로 돌아가기
            </Button>
            <Modal
                title="⚠ 주의 ⚠"
                visible={isWarningVisible}
                maskClosable={false}
                closable={false}
                centered = {true}
                footer={
                    <React.Fragment>
                        <Button key = "ok" type= "primary" onClick={playingListClear}>
                            확인
                        </Button>
                        <Button key = "cancel" onClick={cancelModal}>
                            취소
                        </Button>
                    </React.Fragment>
                }
            >

                <p>첫 화면으로 돌아갑니다.</p>
                <p>이어하기로 돌아올 수 없습니다.</p>
            </Modal>
        </React.Fragment>
    )


}


export default FirstSceneTeleport;
