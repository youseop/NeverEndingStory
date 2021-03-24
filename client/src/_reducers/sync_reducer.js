import {
    LOAD_EMPTY_NUM,
    SAVE_PREV_SCENE
} from '../_actions/types';


export default function (state = {}, action) {
    switch (action.type) {
        case LOAD_EMPTY_NUM:
            return { ...state, emptyNum: action.payload }
        case SAVE_PREV_SCENE:
            return { ...state, prevSceneId: action.payload }
        default:
            return state;
    }
}