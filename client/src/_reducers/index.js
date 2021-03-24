import { combineReducers } from "redux";
import user from "./user_reducer";
import controlpage from "./controlPage_reducer";
import gameplay from "./gamePlay_reducer";
import character from "./characterSelected_reducer";
import characterDisplayed from "./characterDisplayed_reducer";
import movingTarget from "./movingTarget_reducer";


const rootReducer = combineReducers({
  user,
  controlpage,
  gameplay,
  character,
  characterDisplayed,
  movingTarget,
});

export default rootReducer;
