import axios from 'axios';
import {
    LOAD_EMPTY_NUM
} from './types';

export function loadEmptyNum(dataToSubmit){
    const request = dataToSubmit.emptyNum ? dataToSubmit.emptyNum : axios.get(`/api/game/getSceneInfo/${dataToSubmit.sceneId}`)
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
