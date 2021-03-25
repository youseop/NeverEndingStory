import { 
  SELECT_CHARACTER, DETACH_CHARACTER 
} from "./types";

export function selectCharacter(character) {
  return {
    type: SELECT_CHARACTER,
    payload: character,
  };
}

export function detachCharacter() {
  return {
    type: DETACH_CHARACTER,
  };
}