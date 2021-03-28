import { Switch } from 'antd';
import React from 'react';
import '../SceneMakePage2.css';

function SceneBox(props) {
    const { CutList, CutNumber, displayCut, setCutNumber,
        Hover, setHover, EmptyCutList, saveCut } = props;

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
                (<div className="sceneMake__CurrentSceneBox" key={`${index}`}></div>)
            );
        } else {
            if (Hover) {
                return (
                    <div
                        className="sceneMake__SceneBox_color"
                        key={`${index}`}
                        onMouseOver={() => onClick_GotoCut(index)}
                    ></div>
                )
            } else {
                return (
                    <div
                        className="sceneMake__SceneBox_color"
                        key={`${index}`}
                        onClick={() => onClick_GotoCut(index)}
                    ></div>
                )
            }
        }
    });

    const display_EmptyBox = EmptyCutList.map((EmptyCut, index) => {
        if (CutNumber - CutList.length === index) {
            return (
                <div className="sceneMake__CurrentSceneBox" key={`${index}`}></div>
            );
        } else {
            return (
                <div className="sceneMake__EmptySceneBox" key={`${index}`}></div>
            );
        }
    });
    return (
        <div className="box sceneBox">
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

export default SceneBox
