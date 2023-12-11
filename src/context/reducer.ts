import { jwtInitialState, JwtStateType } from "./jwt/context";
import { JwtActions, jwtReducer } from "./jwt/reducer";
import {
  UserPrefStateType,
  userPrefrencesInitialState,
} from "./userPrefs/context";
import {
  UserPreferencesActions,
  userPreferencesReducer,
} from "./userPrefs/reducer";

const initialState = {
  jwt: jwtInitialState,
  userPreferences: userPrefrencesInitialState,
};

type InitialStateType = {
  jwt: JwtStateType;
  userPreferences: UserPrefStateType;
};

const appReducer = (
  { jwt, userPreferences }: InitialStateType,
  action: JwtActions | UserPreferencesActions
) => ({
  jwt: jwtReducer(jwt, action as JwtActions),
  userPreferences: userPreferencesReducer(
    userPreferences,
    action as UserPreferencesActions
  ),
});

export { appReducer, initialState };

export type { InitialStateType };
