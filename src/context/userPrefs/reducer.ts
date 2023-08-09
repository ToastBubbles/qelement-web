import { UserPreferencesStateType, userPrefrencesInitialState } from "./context";
import { ActionMap } from "../../interfaces/context";

export enum Types {
  SetPrefs = "SET_PREFS",
  ClearPrefs = "CLEAR_PREFS",
}

type userPreferencesPayload = {
  [Types.SetPrefs]: {
    userPreferences: UserPreferencesStateType;
  };
  [Types.ClearPrefs]: undefined;
};

export type UserPreferencesActions = ActionMap<userPreferencesPayload>[keyof ActionMap<userPreferencesPayload>];

export const userPreferencesReducer = (state: UserPreferencesStateType, action: UserPreferencesActions): UserPreferencesStateType => {
  switch (action.type) {
    case Types.SetPrefs:
      return {
        ...state,
        ...action.payload
      };
    case Types.ClearPrefs:
      return {
        ...state,
        ...userPrefrencesInitialState
      };
    default:
      return state;
  }
};
