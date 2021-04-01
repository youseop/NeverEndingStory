import React from "react";
import { Relay_Icon, Ending_Icon } from "../../../svg/icon";
import { Modal } from "antd";
import "./EndingModal.css";

const EndingModal = ({ isEnding, visible, setEndingModalState, onSubmit_saveScene }) => {

    const ending = (event) => {
        Modal.warning(
            {
                title: <b>주의!</b>,
                content: (
                    <div>
                        <br></br>
                        <h3>ENDING 체크 시, 이 게임의 엔딩으로 업로드 됩니다.</h3>
                        <h3>따라서 이 씬에 연결되는 씬을 더이상 생성할 수 없습니다.</h3>
                    </div>
                ),
                centered: true,
                width: 650,
                onOk() {
                    event.preventDefault();
                    isEnding.current = true;
                    onSubmit_saveScene()
                    // setEndingModalState(false)
                },
            });
    }


    const choice = (event) => {
        event.preventDefault();
        isEnding.current = false;
        onSubmit_saveScene()
        setEndingModalState(false)
    }

    const cancel = () => {
        setEndingModalState(false)
    }


    return (
        <Modal className="scenemake_modal"
            title="진행 방식을 선택해주세요."
            visible={visible}
            width={900}
            onCancel={cancel}
            centered={true}
            closable={false}
            footer={null}
            bodyStyle={{
                height: "370px",
                display: "flex",
                justifyContent: "space-around",
            }}
        >
            <div
                className="ending_modal_cancel_btn"
                onClick={cancel}>
                X
            </div>
            <div
                className="ending_modal_choice_btn"
                onClick={choice}>
                <Relay_Icon />
                선택의 길
            </div>
            <div
                className="ending_modal_ending_btn"
                onClick={ending}>
                <Ending_Icon />
                엔딩
            </div>
        </Modal>
    )
}

export default EndingModal;
