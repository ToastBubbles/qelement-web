import { JwtStateType, jwtInitialState, JwtPayload } from "./context";
import { ActionMap } from "../../interfaces/context";

export enum Types {
  SetJwt = 'SET_JWT',
  ClearJWT = 'CLEAR_JWT',
}

type JwtPayloadActions = {
  [Types.SetJwt] : {
    token: string;
    jwtPayload: JwtPayload
  };
  [Types.ClearJWT]: undefined
}

export type JwtActions = ActionMap<JwtPayloadActions>[keyof ActionMap<JwtPayloadActions>];

export const jwtReducer = (state: JwtStateType, action: JwtActions): JwtStateType => {
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
        payload: jwtInitialState.payload,
      }
    default:
      return state;
  }
};
