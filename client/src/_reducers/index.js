import { combineReducers } from "redux";
import user from "./user_reducer";
import controlpage from "./controlPage_reducer";
import gameplay from "./gamePlay_reducer";


const rootReducer = combineReducers({
  user,
  controlpage,
  gameplay,
});

export default rootReducer;
