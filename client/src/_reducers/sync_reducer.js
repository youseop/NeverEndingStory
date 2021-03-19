import {
    LOAD_EMPTY_NUM
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case LOAD_EMPTY_NUM:
            return {...state, emptyNum: action.payload }
        default:
            return state;
    }
}