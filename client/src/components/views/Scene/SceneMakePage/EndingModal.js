import React, { useState } from "react";
import { Relay_Icon, Ending_Icon } from "../../../svg/icon";
import { Modal } from "antd";
import "./EndingModal.css";

const EndingModal = ({ isEnding, visible, setEndingModalState, onSubmit_saveScene }) => {
    const [warning, setWarning] = useState(false);

    const ending = (event) => {
        event.preventDefault();
        isEnding.current = true;
        onSubmit_saveScene()
        // setEndingModalState(false)
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
        <Modal className="ending_modal"
            title="진행방식 선택"
            visible={visible}
            onCancel={cancel}
            closable={false}
            footer={null}
        >
            <div
                className="ending_modal_cancel_btn"
                onClick={cancel}>
                X
            </div>
            <div
                className="ending_modal_choice_btn"
                onClick={choice}>
                <div className="ending_modal_choice_container">
                    <Relay_Icon />
                    <div className="ending_modal_description">
                        다른 사람이 해당
                        컷에서 계속 이야
                        기를 진행해 나갈
                        수 있게 선택지가
                        네 개 제공됩니다
                    </div>
                </div>
                이어 가기
            </div>
            <div
                className="ending_modal_choice_btn"
                onClick={() => setWarning(true)}>
                <div className="ending_modal_choice_container">
                    <Ending_Icon />
                    <div className="ending_modal_description">
                        해당 컷이 이야기
                        의 마지막이 되며
                        다른 사용자는 더
                        이상 이야기를 덧
                        붙일 수 없습니다
                    </div>
                </div>
                엔딩
            </div>
            <Modal
                visible={warning}
                onOk={ending}
                onCancel={() => setWarning(false)}
                centered={true}
                closable={false}
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
                    <h3>엔딩으로 업로드 됩니다.</h3>
                    <h3>따라서 이 이야기 이후에 다른 작가가 더이상 이야기를 이어갈 수 없습니다.</h3>
                </div>
            </Modal>
        </Modal >
    )
}

export default EndingModal;
