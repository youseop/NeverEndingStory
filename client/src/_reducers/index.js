import { combineReducers } from 'redux';
import user from './user_reducer';
import sync from './sync_reducer';

const rootReducer = combineReducers({
    user, sync,
});

export default rootReducer;