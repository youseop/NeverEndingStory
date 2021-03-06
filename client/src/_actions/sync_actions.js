import axios from 'axios';
import {
    LOAD_EMPTY_NUM,
    SAVE_PREV_SCENE
} from './types';

export function loadEmptyNum(dataToSubmit){
    const request = dataToSubmit.emptyNum !== undefined ? dataToSubmit.emptyNum : axios.get(`/api/scene/${dataToSubmit.sceneId}`)
        .then(response => {
            if(response.data.success){
                const scene = response.data.scene;
                return scene.sceneTmp.emptyNum;
            }
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
