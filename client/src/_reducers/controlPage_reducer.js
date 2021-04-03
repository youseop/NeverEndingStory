import { NAVBAR_CONTROL, FOOTER_CONTROL } from "../_actions/types";

const initialState = { navbarOn: true, footerOn: true };

export default function (state = initialState, action) {
  switch (action.type) {
    case NAVBAR_CONTROL:
      return { ...state, navbarOn: action.payload };
    case FOOTER_CONTROL:
      return { ...state, footerOn: action.payload };
    default:
      return state;
  }
}
