import axios from 'axios';
import {
    LOAD_EMPTY_NUM
} from './types';

export function loadEmptyNum(dataToSubmit){
    const request = axios.get(`/api/game/getSceneInfo/${dataToSubmit.sceneId}`)
        .then(response => {
            const scene = response.data.scene;
            console.log(scene);
            return scene.sceneTmp.emptyNum;
        });
    
    return {
        type: LOAD_EMPTY_NUM,
        payload: request
    };
}
