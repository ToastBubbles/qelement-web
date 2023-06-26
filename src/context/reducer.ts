import React from "react";
import { jwtInitialState, JwtStateType } from "./jwt/context";
import { JwtActions, jwtReducer } from "./jwt/reducer";
import {
  UserPreferencesStateType,
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
  userPreferences: UserPreferencesStateType;
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
