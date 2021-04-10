import { ConsoleSqlOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import React, { memo } from 'react';
import '../SceneMakePage.css';
import './SceneBox.css';

function SceneBox(props) {
    const { CutList, CutNumber, displayCut, setCutNumber,
        Hover, setHover, EmptyCutList, saveCut, onClick_plusBtn, onRemove_cut } = props;

    const onClick_GotoCut = (index) => {
        if (CutNumber > 29) {
            displayCut(index);
            setCutNumber(index);
            return;
        }
        if (CutNumber !== index) {
            saveCut();
            displayCut(index);
            setCutNumber(index);
        }
    };

    const display_SceneBox = CutList.map((Cut, index) => {
        if (CutNumber === index) {
            return (
                (<div className="scene__SceneBox" key={`${index}`}>
                    <div className="scene__CurrentSceneBox"></div>
                </div>)
            );
        } else {
            if (Hover) {
                return (
                    <div
                        className="scene__SceneBox"
                        key={`${index}`}
                        onMouseOver={() => onClick_GotoCut(index)}
                    ></div>
                )
            } else {
                return (
                    <div
                        className="scene__SceneBox"
                        key={`${index}`}
                        onClick={() => onClick_GotoCut(index)}
                    >
                        <div className="scene__SceneBox_color"></div>
                    </div>
                )
            }
        }
    });

    const display_EmptyBox = EmptyCutList.map((EmptyCut, index) => {
        if (CutNumber - CutList.length === index) {
            if (index === 0)
                return (
                    <div className="scene__SceneBox" key={`${index}`}>
                        <div className="scene__CurrentSceneBox" />
                    </div>
                );
        } else if (index === 0 || index === 1 && CutNumber - CutList.length === 0) {
            return (
                <div className="scene__SceneBox" onClick={onClick_plusBtn} key={`${index}`}>
                    <div className="sceneBox_plus">
                        <div className="sceneBox_plus_horizonal" />
                        <div className="sceneBox_plus_vertical" />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="scene__SceneBox" key={`${index}`}>
                    <div className="scene__EmptySceneBox" />
                </div>
            );
        }
    });
    return (
        <div className="sceneBox">
            <div className={((CutList.length) === 30 || (CutNumber + 1) === 30) ?
                "sceneBox_cutnumber max" : "sceneBox_cutnumber"}>
                {CutNumber - CutList.length === 0 || CutNumber - CutList.length === -1 ?
                    `${CutNumber + 1}/30` : `${CutNumber + 1}/${CutList.length}`}</div>
            {display_SceneBox}
            {display_EmptyBox}
            <div className="sceneBox_del_btn" onClick={onRemove_cut}>컷 삭제</div>
            {/* <Switch
                checked={Hover}
                checkedChildren={CutNumber}
                unCheckedChildren={CutNumber}
                onChange={() => { setHover((state) => !state) }}
                size="small"
            /> */}
        </div>
    )
}

export default memo(SceneBox)
