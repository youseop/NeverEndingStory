import { LOADINGPAGE_GAMEPLAY } from "../_actions/types";

const initialState = { loadingType: 0 };

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADINGPAGE_GAMEPLAY:
      return { ...state, loadingType: action.payload };
    default:
      return state;
  }
}
