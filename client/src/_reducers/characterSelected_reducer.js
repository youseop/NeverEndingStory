import {
  SELECT_CHARACTER,
  DETACH_CHARACTER,
  PUSH_CHARACTER,
  POP_CHARACTER,
  UPDATE_CHARACTER,
  SET_CHARACTER_LIST,
  ORDER_CHARACTER
} from '../_actions/types';

const initialState = {
  description: "",
  image: "",
  image_array: [],
  name: "",
  _id: "",
  index: -1
}

export default function (state = { characterSelected: initialState, CharacterList: [] }, action) {

  switch (action.type) {
    case SELECT_CHARACTER:
      return { ...state, characterSelected: action.payload }
    case DETACH_CHARACTER:
      return { ...state, characterSelected: initialState }
    case PUSH_CHARACTER:
      return { ...state, CharacterList: action.payload }
    case POP_CHARACTER:
      return { ...state, CharacterList: action.payload }
    case UPDATE_CHARACTER:
      return { ...state, CharacterList: action.payload }
    case SET_CHARACTER_LIST:
      return { ...state, CharacterList: action.payload }
    case ORDER_CHARACTER:
      return { ...state, CharacterList: action.payload }
    default:
      return state;
  }
}