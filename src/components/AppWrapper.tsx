import { ReactNode, useContext, useEffect } from "react";
import { getJWT } from "../auth/auth";
import { AppContext } from "../context/context";
import { Types as jwtType } from "../context/jwt/reducer";
import Cookies from "js-cookie";
import { JwtPayload } from "../context/jwt/context";
import { JWTPayload } from "jose";
import { Types as prefType } from "../context/userPrefs/reducer";
import { useQuery } from "react-query";
import axios from "axios";
import { IUserDTO } from "../interfaces/general";
import {
  UserPrefPayload,
  UserPrefStateType,
} from "../context/userPrefs/context";

interface IProps {
  children?: ReactNode;
}

export default function AppWrapper({ children }: IProps) {
  const {
    dispatch,
    state: {
      jwt: {
        payload: { id: userId },
      },
    },
  } = useContext(AppContext);

  const { data, refetch } = useQuery({
    queryKey: `user${userId}`,
    queryFn: () =>
      axios.get<IUserDTO>(`http://localhost:3000/user/id/${userId}`),
    onSuccess: () => {},
    enabled: false,
  });

  useEffect(() => {
    const access_token = Cookies.get("userJWT");
    if (access_token != null) {
      let id: number;
      getJWT(access_token).then((jwtPayloadResp) => {
        id = (jwtPayloadResp as unknown as JwtPayload).id;
        dispatch({
          type: jwtType.SetJwt,
          payload: {
            token: access_token,
            jwtPayload: jwtPayloadResp as unknown as JwtPayload,
          },
        });
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (userId > 0) {
      refetch().then((d) => {
        if (d.data) {
          let prefs = d.data.data.preferences;
          dispatch({
            type: prefType.SetPrefs,
            payload: { prefPayload: prefs as unknown as UserPrefPayload },
          });
        }
        // console.log("data is here:", data.data.preferences);

        // console.log("d", d);
      });
    } else {
    }
    // console.log("Got here", userId );
    // if (!!userId) {
    //   getUserPrefs(userId).then((userPrefs) => {
    //     console.log("up", userPrefs);

    //     if (userPrefs != undefined)
    //       dispatch({
    //         type: prefType.SetPrefs,
    //         payload: {
    //           userPreferences: { userId: userId, ...userPrefs },
    //         },
    //       });
    //   });
    // }
  }, [userId]);

  return <>{children}</>;
}
