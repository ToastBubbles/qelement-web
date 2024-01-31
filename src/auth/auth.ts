import axios from "axios";
import { JWTPayload, importSPKI, jwtVerify } from "jose";
import Cookies from "js-cookie";
import { ILoginDTO } from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";

export async function getJWT(token: string): Promise<JWTPayload> {
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

  if (token !== null && token != "null") {
    const result = await jwtVerify(token as string, publicKey);
    return result.payload;
  } else {
    return {};
  }
}

export const getToken = () => {
  return Cookies.get("userJWT");
};

export async function login(
  loginDTO: ILoginDTO
): Promise<{ token: string; jwtPayload: JWTPayload }> {
  return new Promise((resolve, reject) => {
    axios
      .post<{ access_token: string }>(
        `http://localhost:3000/auth/login`,
        loginDTO
      )
      .then((resp) => {
        const { access_token } = resp.data;
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
          showToast("Incorrect login credentials", Mode.Error);
          reject();
        }
      });
  });
}
