import { 
  SELECT_DISPLAYED 
} from "./types";


export function selectDisplayed(character) {
  return {
    type: SELECT_DISPLAYED,
    payload: character,
  };
}