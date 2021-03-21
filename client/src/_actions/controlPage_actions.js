import { NAVBAR_CONTROL } from "./types";

export function navbarControl(navbarOn) {
  return {
    type: NAVBAR_CONTROL,
    payload: navbarOn,
  };
}
