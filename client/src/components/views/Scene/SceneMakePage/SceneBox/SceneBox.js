import { ConsoleSqlOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import React, { memo } from 'react';
import '../SceneMakePage.css';
import './SceneBox.css';

function SceneBox(props) {
    const { CutList, CutNumber, displayCut, setCutNumber,
        Hover, setHover, EmptyCutList, saveCut, onClick_plusBtn } = props;

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
                (<div className="scene__CurrentSceneBox" key={`${index}`}></div>)
            );
        } else {
            if (Hover) {
                return (
                    <div
                        className="scene__SceneBox_color"
                        key={`${index}`}
                        onMouseOver={() => onClick_GotoCut(index)}
                    ></div>
                )
            } else {
                return (
                    <div
                        className="scene__SceneBox_color"
                        key={`${index}`}
                        onClick={() => onClick_GotoCut(index)}
                    ></div>
                )
            }
        }
    });

    const display_EmptyBox = EmptyCutList.map((EmptyCut, index) => {
        if (CutNumber - CutList.length === index) {
            if (index === 0)
                return (
                    <div className="scene__CurrentSceneBox" key={`${index}`}></div>
                );
        } else if (index === 0 || index === 1 && CutNumber - CutList.length === 0) {
            return (
                <div className="sceneBox_plus" onClick={onClick_plusBtn} key={`${index}`}>+</div>
            );
        } else {
            return (
                <div className="scene__EmptySceneBox" key={`${index}`}></div>
            );
        }
    });
    return (
        <div className="sceneBox">
            <div className={((CutList.length) === 30 || (CutNumber + 1) === 30) ?
                "sceneBox_cutnumber max" : "sceneBox_cutnumber"}>{CutNumber + 1}/30</div>
            {display_SceneBox}
            {display_EmptyBox}
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
