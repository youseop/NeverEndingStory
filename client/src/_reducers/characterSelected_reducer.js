import {
  SELECT_CHARACTER, DETACH_CHARACTER
} from '../_actions/types';

const initialState = {description: "",
                      image: "",
                      image_array: [],
                      name: "",
                      _id: "",
                      index: -1}
                      
export default function(state={characterSelected : initialState},action){

  switch(action.type){
      case SELECT_CHARACTER:
          return {...state, characterSelected: action.payload }
      case DETACH_CHARACTER:
          return {...state, characterSelected: initialState }
      default:
          return state;
  }
}