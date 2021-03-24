import { LOADINGPAGE_GAMEPLAY, PAUSE_GAMEPLAY } from "./types";

export function gameLoadingPage(loadingType) {
  return {
    type: LOADINGPAGE_GAMEPLAY,
    payload: loadingType,
  };
}

export function gamePause(isPause) {
  return {
    type: PAUSE_GAMEPLAY,
    payload: isPause,
  };
}
