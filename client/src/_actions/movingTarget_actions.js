import { 
  SELECT_MOVINGTARGET, DETACH_MOVINGTARGET 
} from "./types";

export function selectMovingTarget(character) {
  return {
    type: SELECT_MOVINGTARGET,
    payload: character,
  };
}

export function detachMovingTarget(character) {
  return {
    type: DETACH_MOVINGTARGET,
    payload: character,
  };
}
