import React, {createContext, useReducer} from 'react';
import { jwtReducer } from './reducer';

export interface JwtStateType {
  token: string;
  payload: object;
}

export const jwtInitialState = {
  token: '',
  payload: {},
};

