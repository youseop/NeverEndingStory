import { NAVBAR_CONTROL, FOOTER_CONTROL } from "./types";

export function navbarControl(navbarOn) {
  return {
    type: NAVBAR_CONTROL,
    payload: navbarOn,
  };
}

export function footerControl(footerOn) {
  return {
    type: FOOTER_CONTROL,
    payload: footerOn,
  };
}
