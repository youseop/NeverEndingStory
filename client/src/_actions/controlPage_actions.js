import { NAVBAR_CONTROL, FOOTER_CONTROL, SEARCH_CONTROL } from "./types";

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

export function searchControl(searchOn) {
  return {
    type: SEARCH_CONTROL,
    payload: searchOn,
  };
}
