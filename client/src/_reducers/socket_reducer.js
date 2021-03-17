import {combineReducers} from 'redux';
import * as type from '../constants/actionTypes';

const chatStates = {
    chatList: [],
    socketId: null
};

export default (state = chatStates, action) => {
    switch(action.type){
        case type.MY_SOCKET_ID:
            return { ...state, socketId: action.socketId };
        case type.RECEIVE_CHAT:
            let newChatList = state.chatList.slice();
            newChatList.push(action.data);
            return { ...state, chatList: newChatList };
        case type.CLEAR_CHAT:
            return {...state, chatList: []}
        default:
            return state;
    }
}