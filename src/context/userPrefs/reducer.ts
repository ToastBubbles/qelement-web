import {
  UserPrefPayload,
  UserPrefStateType,
  userPrefrencesInitialState,
} from "./context";
import { ActionMap } from "../../interfaces/context";

export enum Types {
  SetPrefs = "SET_PREFS",
  ClearPrefs = "CLEAR_PREFS",
}

type userPreferencesPayload = {
  [Types.SetPrefs]: {
    prefPayload: UserPrefPayload;
  };
  [Types.ClearPrefs]: undefined;
};

export type UserPreferencesActions =
  ActionMap<userPreferencesPayload>[keyof ActionMap<userPreferencesPayload>];

export const userPreferencesReducer = (
  state: UserPrefStateType,
  action: UserPreferencesActions
): UserPrefStateType => {
  switch (action.type) {
    case Types.SetPrefs:
      return {
        ...state,
        payload: action.payload?.prefPayload,
      };
    case Types.ClearPrefs:
      return {
        ...state,
        payload: userPrefrencesInitialState.payload,
      };
    default:
      return state;
  }
};
