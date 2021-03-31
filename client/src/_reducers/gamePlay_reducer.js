import { LOADINGPAGE_GAMEPLAY, PAUSE_GAMEPLAY } from "../_actions/types";

const initialState = { loadingType: 0, isPause: false };

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADINGPAGE_GAMEPLAY:
      return { ...state, loadingType: action.payload };
    case PAUSE_GAMEPLAY:
      return { ...state, isPause: action.payload };
    default:
      return state;
  }
}
