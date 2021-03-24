import axios from 'axios';
import {
    LOAD_EMPTY_NUM,
    SAVE_PREV_SCENE
} from './types';

export function loadEmptyNum(dataToSubmit){
    console.log(dataToSubmit)
    const request = dataToSubmit.emptyNum !== undefined ? dataToSubmit.emptyNum : axios.get(`/api/game/getSceneInfo/${dataToSubmit.sceneId}`)
        .then(response => {
            console.log(response.data);
            const scene = response.data.scene;
            return scene.sceneTmp.emptyNum;
        });

    return {
        type: LOAD_EMPTY_NUM,
        payload: request
    };
}

export function savePrevScene(dataToSubmit){
    const request = dataToSubmit.prevSceneId;

    return {
        type: SAVE_PREV_SCENE,
        payload: request
    };
}
