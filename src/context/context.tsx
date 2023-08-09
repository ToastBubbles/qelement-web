import  {
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  FC,
} from "react";
import { JwtActions } from "./jwt/reducer";
import { appReducer, initialState, InitialStateType } from "./reducer";
import { UserPreferencesActions } from "./userPrefs/reducer";

interface IProps {
  children?: ReactNode;
}

const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<JwtActions | UserPreferencesActions>;
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
 