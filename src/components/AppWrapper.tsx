import { ReactNode, useContext, useEffect } from "react";
import { getJWT } from "../auth/auth";
import { AppContext } from "../context/context";
import { Types } from "../context/jwt/reducer";
import Cookies from "js-cookie";


interface IProps {
    children?: ReactNode
}

export default function AppWrapper({ children }: IProps) {
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    const access_token = Cookies.get("userJWT");
    if (access_token != null) {
      getJWT(access_token).then((jwtPayload) => {
        dispatch({
          type: Types.SetJwt,
          payload: {
            token: access_token,
            jwtPayload,
          },
        });
      });
    }
  }, []);

  return <>{children}</>;
}
