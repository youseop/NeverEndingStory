
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "axios";
import { Button, Modal } from "antd";

import "../SceneEndingPage/SceneEndingPage.css";



const FirstSceneTeleport = ({ gameId, setScene }) => {
    const history = useHistory();
    const user = useSelector((state) => state.user);
    const [isWarningVisible, setIsWarningVisible] = useState(false)

    const playingListClear = () => {

        if (user) {
            //! auth를 통해서 쿠키에서 유저정보 갖고올 수 있다.
            Axios.post("/api/users/playing-list/clear").
                then(response => {
                    if (response.data.success) {
                        setIsWarningVisible(false)
                        setScene({})
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
                visible={isWarningVisible}
                onOk={playingListClear}
                onCancel={cancelModal}
                maskClosable={false}
                closable={false}
                centered={true}
                width={650}
                bodyStyle={{
                    height: "170px",
                    display: "flex",
                }}
                okText="확인"
                cancelText="취소"
            >
                <div className="ending_modal_warning_sign"><svg color="#faad14" viewBox="64 64 896 896" focusable="false" className="" data-icon="exclamation-circle" width="20px" height="20px" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path></svg></div>
                <div className="ending_modal_warning_textarea">
                    <h2>주의!</h2>
                    <br></br>
                    <h3>스토리의 첫 장면으로 돌아갑니다.</h3>
                    <h3>특정 장면으로 돌아가길 원하시면 오른쪽 아래 미니맵을 이용해주세요</h3>
                </div>
            </Modal>
        </React.Fragment>
    )


}


export default FirstSceneTeleport;
