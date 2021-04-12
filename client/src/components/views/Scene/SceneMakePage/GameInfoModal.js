import React, { useState } from "react";
import { Modal } from "antd";
import GameInfoModalTab from "./Tab/GameInfoModalTab";
import GameInfoTab from "./Tab/GameInfoTab";
import ActorTab from "./Tab/ActorTab";
import "./GameInfoModal.css";

const GameInfoModal = ({ visible, setGameInfoModalState, gameDetail, isMake }) => {
    const [tag, setTag] = useState(1);
    const cancel = () => {
        setGameInfoModalState(false)
    }

    return (
        <Modal className="scenemake_essetmodal info"
            visible={visible}
            okText="확인"
            cancelText="취소"
            onCancel={cancel}
            onOk={cancel}
        >
            <div className="sceenmake_essetmodal_container">
                <GameInfoModalTab setTag={setTag} tag={tag} />
                {tag === 1 &&
                    <GameInfoTab
                        gameDetail={gameDetail}
                        isMake={isMake}
                    />
                }
                {tag === 2 &&
                    <ActorTab
                        gameDetail={gameDetail}
                    />
                }
            </div>
        </Modal>
    )
}

export default GameInfoModal;
