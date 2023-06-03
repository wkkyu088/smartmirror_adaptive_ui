import { SET_AGE, SET_POS, SET_SCALE } from './types';

export const setAge = (value: any) => {
    return {
        type: SET_AGE,
        payload: value,
    };
};

export const setPos = (value: any) => {
  return {
      type: SET_POS,
      payload: value,
  };
};

export const setScale = (value: any) => {
  return {
      type: SET_SCALE,
      payload: value,
  };
};
