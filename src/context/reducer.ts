import React from "react";
import { jwtInitialState, JwtStateType } from "./jwt/context";
import { JwtActions, jwtReducer } from "./jwt/reducer";



const initialState = {
  jwt: jwtInitialState,
};

type InitialStateType = {
  jwt: JwtStateType;
}; 

const appReducer = ({ jwt }: InitialStateType, action: JwtActions) => ({
  jwt: jwtReducer(jwt, action),
});

export {
  appReducer,
  initialState,
}

export type {
  InitialStateType
}