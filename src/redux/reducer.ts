import { SET_AGE, SET_POS, SET_SCALE } from './types';

const initialState = {
    age: 25,
    pos: 0,
    scale: 1,
};  

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_AGE:
      return {
        ...state,
        age: action.payload,
      };
    case SET_POS:
      return {
        ...state,
        pos: action.payload,
      };
    case SET_SCALE:
      return {
        ...state,
        scale: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;