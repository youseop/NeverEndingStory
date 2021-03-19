import { NAVBAR_CONTROL } from "../_actions/types";

const initialState = { navbarOn : true };

export default function (state = initialState, action) {
  switch (action.type) {
    case NAVBAR_CONTROL:
      return { ...state, navbarOn: action.payload };
    default:
      return state;
  }
}