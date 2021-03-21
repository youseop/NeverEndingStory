import { combineReducers } from "redux";
import user from "./user_reducer";
import controlpage from "./controlPage_reducer";
import gameplay from "./gamePlay_reducer";
import sync from './sync_reducer';


const rootReducer = combineReducers({
  user,
  controlpage,
  gameplay,
  sync,
});

export default rootReducer;
