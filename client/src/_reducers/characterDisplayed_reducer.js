import {
  SELECT_DISPLAYED
} from '../_actions/types';

const initialState = {index: -1}
                      
export default function(state={characterDisplayed : initialState},action){

  switch(action.type){
      case SELECT_DISPLAYED:
          return {...state, characterDisplayed: action.payload }
      default:
          return state;
  }
}