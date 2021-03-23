import { 
  SELECT_MOVINGTARGET, DETACH_MOVINGTARGET 
} from "./types";

export function selectMovingTarget(character) {
  return {
    type: SELECT_CHARACTER,
    payload: character,
  };
}

export function detachMovingTarget(character) {
  return {
    type: DETACH_CHARACTER,
    payload: character,
  };
}
