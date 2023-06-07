
// Short duration JWT token (5-10 min)
// export function getJwtToken() {
//   return sessionStorage.getItem("jwt");
// }

import axios from "axios";
import { importSPKI, jwtVerify } from "jose";
import { ILoginDTO } from "../interfaces/general";
import Cookies from "js-cookie";


// export function setJwtToken(token: any) {
//   sessionStorage.setItem("jwt", token);
// }

// // Longer duration refresh token (30-60 min)
// export function getRefreshToken() {
//   return sessionStorage.getItem("refreshToken");
// }

// export function setRefreshToken(token: any) {
//   sessionStorage.setItem("refreshToken", token);
// }

// export async function handleLogin({ username, password }: ILoginDTO) {
//   // Call login method in API
//   // The server handler is responsible for setting user fingerprint cookie during this as well
//   //   const { jwtToken, refreshToken } =
//   await login({ username, password });
//   //   setJwtToken(jwtToken);
//   //   setRefreshToken(refreshToken);

//   // If you like, you may redirect the user now
//   //   navigate("/some-url");
// }

export async function getJWT(token: string): Promise<Object> {
  const algorithm = "RS256";
  const spki = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlT9HNfa+VXFuJ+apLiNz
eIdx9KbAETY5cnOkxqYkwoZHRDGF4rocTLcvM7d3dCyOpWHd5b1t1B28m/vp1EMI
egPvTl0aIobq7DFKQrXGcO/NGp8GtyvJLlPI3khxScopprRCJiGcc/ub1THkJ9eR
a/YVfYJsoRzws6/Kf3EZ6quecCbMrO013B54ixuyMXfCNgdIEpakR7ue7EdN+4N/
8bb6KBV8m8G/39SPDyOYoON2nYWeKpsTRB8Z31xqLMPT4H+UPF2/O7yr/YEq2Iqa
i9MgVWxJARlC+RCtzTTg7/UE9fm7fQVSsvbwz7XR8bBWYZZrFD8duejIfNLCHbft
/wIDAQAB
-----END PUBLIC KEY-----`;
  const publicKey = await importSPKI(spki, algorithm);

  // let result = null;
  if (token !== null && token != "null") {
    const result = await jwtVerify(token as string, publicKey);
    // console.log("setting");

    return result.payload;
  } else {
    return {};
  }
}

export async function login(
  loginDTO: ILoginDTO
): Promise<{ token: string; jwtPayload: object }> {
  return new Promise((resolve, reject) => {
    axios
      .post<{ access_token: string }>(
        `http://localhost:3000/auth/login`,
        loginDTO
      )
      .then((resp) => {
        // console.log("in auth:", resp);

        const { access_token } = resp.data;

        // console.log("got this far", access_token);

        if (access_token != null) {
          Cookies.set("userJWT", access_token);
          getJWT(access_token).then((jwtPayload) => {
            console.log("ooops", jwtPayload);
            resolve({
              token: access_token,
              jwtPayload,
            });
          });
        } else {
          reject();
        }
      });
  });
}

export function logout() {
  Cookies.set("userJWT", "null");
}
