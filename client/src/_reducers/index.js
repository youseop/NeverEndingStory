import { combineReducers } from "redux";
import user from "./user_reducer";
import gameplay from "./gamePlay_reducer";

const rootReducer = combineReducers({
  user,
  gameplay,
});

export default rootReducer;
