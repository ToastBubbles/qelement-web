import { JwtStateType } from "./context";
import { ActionMap } from "../../interfaces/context";

export enum Types {
  SetJwt = 'SET_JWT',
  ClearJWT = 'CLEAR_JWT',
}

type JwtPayload = {
  [Types.SetJwt] : {
    token: string;
    jwtPayload: JwtPayload
  };
  [Types.ClearJWT]: undefined
}

export type JwtActions = ActionMap<JwtPayload>[keyof ActionMap<JwtPayload>];

export const jwtReducer = (state: JwtStateType, action: JwtActions) => {
  switch (action.type) {
    case Types.SetJwt:
      return {
        ...state,
        token: action.payload?.token,
        payload: action.payload?.jwtPayload,
      };
    case Types.ClearJWT:
      return {
        ...state,
        token: '',
        payload: {},
      }
    default:
      return state;
  }
};
