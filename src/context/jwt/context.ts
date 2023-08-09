export interface JwtPayload {
  exp: number;
  iat: number;
  id: number;
  username: string;
}

export interface JwtStateType {
  token: string;
  payload: JwtPayload;
}

export const jwtInitialState: JwtStateType = {
  token: "",
  payload: {
    exp: 0,
    iat: 0,
    id: 0,
    username: "",
  },
};
