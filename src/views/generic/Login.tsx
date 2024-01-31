import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { ILoginDTO } from "../../interfaces/general";
import { AppContext } from "../../context/context";
import { login } from "../../auth/auth";
import { Types } from "../../context/jwt/reducer";
import { JwtPayload } from "../../context/jwt/context";

export default function Login() {
  const { dispatch } = useContext(AppContext);

  const [loginDTO, setLoginDTO] = useState<ILoginDTO>({
    username: "",
    password: "",
  });
  // const [loginError, setLoginError] = useState<boolean>(false);
  const navigate = useNavigate();

  const attemptLogin = (creds: ILoginDTO) => {
    login(creds).then(({ token, jwtPayload }) => {
      dispatch({
        type: Types.SetJwt,
        payload: {
          token,
          jwtPayload: jwtPayload as unknown as JwtPayload,
        },
      });

      if (token && jwtPayload) {
        navigate("/profile");
      }
      //  else {
      //   setLoginError(true);
      // }
    });
  };
  return (
    <>
      <div className="formcontainer">
        <h1>login</h1>
        <div className="mainform">
          <input
            placeholder="Username"
            // type="email"
            onChange={(e) =>
              setLoginDTO((loginDTO) => ({
                ...loginDTO,
                ...{ username: e.target.value },
              }))
            }
          />
          <input
            placeholder="Password"
            type="password"
            onChange={(e) =>
              setLoginDTO((loginDTO) => ({
                ...loginDTO,
                ...{ password: e.target.value },
              }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                attemptLogin(loginDTO);
              }
            }}
          />

          <button
            onClick={() => {
              attemptLogin(loginDTO);
            }}
          >
            Login
          </button>

          <Link className="link" to="/forgot">
            forgot password?
          </Link>
          <Link className="link" to="/register">
            Register for an account
          </Link>
        </div>
      </div>
    </>
  );
}
