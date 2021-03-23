import { 
  SELECT_MOVINGTARGET, DETACH_MOVINGTARGET 
} from "../_actions/types";


const initialState = { movingTarget: -1 };

export default function (state = initialState, action) {
  switch (action.type) {
    case SELECT_MOVINGTARGET:
      return { ...state, movingTarget: action.payload };
    case DETACH_MOVINGTARGET:
      return { ...state, movingTarget: action.payload };
    default:
      return state;
  }
}
