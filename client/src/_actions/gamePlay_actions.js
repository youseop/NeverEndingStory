import { LOADINGPAGE_GAMEPLAY } from "./types";

export function gameLoadingPage(loadingType) {
  return {
    type: LOADINGPAGE_GAMEPLAY,
    payload: loadingType,
  };
}
