import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./HistoryMap.css";
import { message, Button, Modal } from "antd";
import { SVG } from "../../svg/icon";
import "./LogPopup.css";



function LogPopup(props) {
    const { setTrigger, trigger, cutList, i } = props;
    //   const { gameId, sceneId } = props.history;

    function close_button() {
        setTrigger(false);
    }

    function LogContainer() {
        const log = cutList.slice(0, i + 1).map(item => {
            return <div className="log">{item?.name}: {item?.script}</div>
        })
        return log;
    }
    return trigger ? (
        <div className="HistoryMap_popup log">
            <div className="close_btn" onClick={() => close_button()}>
                <SVG
                    className="close_btn"
                    src="close_2"
                    width="45"
                    height="50"
                    color="#F5F5F5"
                ></SVG>
            </div>
            <div className="log_container">
                <div className="log_title">대화 기록</div>
                <div className="log_box">
                    <LogContainer />
                </div>
            </div>
        </div>
    ) : null;
}

export default LogPopup;
