import React, {
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  FC,
} from "react";
import { jwtInitialState, JwtStateType } from "./jwt/context";
import { JwtActions, jwtReducer } from "./jwt/reducer";
import { appReducer, initialState, InitialStateType } from "./reducer";

interface IProps {
  children?: ReactNode;
}

const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<JwtActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const AppProvider: FC<IProps> = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
 