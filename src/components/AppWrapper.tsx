import { ReactNode, useContext, useEffect } from "react";
import { getJWT } from "../auth/auth";
import { AppContext } from "../context/context";
import { Types } from "../context/jwt/reducer";
import Cookies from "js-cookie";
import { JwtPayload } from "../context/jwt/context";

interface IProps {
  children?: ReactNode;
}

export default function AppWrapper({ children }: IProps) {
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    const access_token = Cookies.get("userJWT");
    if (access_token != null) {
      getJWT(access_token).then((jwtPayloadResp) => {
        dispatch({
          type: Types.SetJwt,
          payload: {
            token: access_token,
            jwtPayload: jwtPayloadResp as unknown as JwtPayload,
          },
        });
      });
    }
  }, [dispatch]);

  return <>{children}</>;
}
