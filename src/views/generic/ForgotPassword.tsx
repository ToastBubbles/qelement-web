import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  IAPIResponse,
  ILoginDTO,
  ISecurityQuestionDTO,
  IUserForgotPwd,
  IUserRecoveryDTO,
  IUserWSecQDTO,
} from "../../interfaces/general";
import { AppContext } from "../../context/context";
import { useQuery } from "react-query";
import axios from "axios";
import showToast, { Mode } from "../../utils/utils";

export default function ForgotPassword() {
  const { dispatch } = useContext(AppContext);

  const [email, setEmail] = useState<string>("");
  const [answer1, setAnswer1] = useState<string>("");
  const [answer2, setAnswer2] = useState<string>("");
  const [answer3, setAnswer3] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  //   const [userData, setUserData] = useState<IUserRecoveryDTO | undefined>(
  //     undefined
  //   );

  const navigate = useNavigate();

  //   const attemptLogin = (creds: ILoginDTO) => {
  //     login(creds).then(({ token, jwtPayload }) => {
  //       dispatch({
  //         type: Types.SetJwt,
  //         payload: {
  //           token,
  //           jwtPayload: jwtPayload as unknown as JwtPayload,
  //         },
  //       });

  //       if (token && jwtPayload) {
  //         navigate("/profile");
  //       }
  //     });
  //   };

  const { data: userData, refetch: refetchEmail } = useQuery<
    IUserRecoveryDTO | IAPIResponse | undefined
  >(
    "checkEmail",
    async () => {
      try {
        if (
          email.length > 5 &&
          !email.trim().includes(" ") &&
          email.includes("@")
        ) {
          const response = await axios.get<IUserRecoveryDTO | IAPIResponse>(
            `http://localhost:3000/user/getQuestions/${email.trim()}`
          );

          if ("code" in response.data) {
            const apiResponse = response.data as IAPIResponse;
            if (apiResponse.code == 404) {
              showToast(
                "No user found. Verify the email is correct",
                Mode.Error
              );
            }
            // Handle the IAPIResponse
            return undefined; // Return undefined here if needed
          } else {
            // Handle the IUserWSecQDTO
            console.log(response.data);

            return response.data as IUserRecoveryDTO;
          }
        } else {
          showToast("Invalid Email address!", Mode.Error);
          return undefined; // Return undefined here if needed
        }
      } catch (error) {
        console.log(error);
        return undefined; // Return undefined here if needed
      }
    },
    {
      staleTime: 100,
      enabled: false,
    }
  );

  const {
    data: q1APIResponse,
    isFetched,
    refetch: q1Refetch,
  } = useQuery(
    "q1",
    async () => {
      let id = -1;
      if (userData && "name" in userData) {
        id = (userData as IUserRecoveryDTO).securityQuestions[0].id;
      }
      const resp = await axios.post<IAPIResponse>(
        "http://localhost:3000/securityQuestion/check",
        { questionId: id, answer: answer1 } as ISecurityQuestionDTO
      );
      if (resp.data.code != 200) {
        showToast("Incorrect answer!", Mode.Error);
      }
      console.log(resp.data);

      return resp.data;
    },
    {
      enabled: false,
    }
  );

  return (
    <>
      <div className="formcontainer">
        <h1>Reset Password</h1>
        <div className="mainform">
          {!userData || "code" in userData ? (
            <>
              <p>Enter the email associated with the account:</p>
              <input
                placeholder="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />

              <button
                onClick={() => {
                  //   attemptLogin(loginDTO);
                  refetchEmail();
                }}
              >
                Submit
              </button>
            </>
          ) : (
            <>
              {!q1APIResponse ||
              (q1APIResponse && q1APIResponse.code != 200) ? (
                <>
                  <p>Question 1:</p>
                  <p>
                    {userData.securityQuestions[0].predefinedQuestion.question}
                  </p>
                  <input
                    placeholder="Answer"
                    type="text"
                    onChange={(e) => setAnswer1(e.target.value.toLowerCase())}
                  />
                  <p>(These answers are not case-sensitive)</p>

                  <button
                    onClick={() => {
                      q1Refetch();
                      //   attemptLogin(loginDTO);
                    }}
                  >
                    Submit
                  </button>
                </>
              ) : (
                <>
                  <p>Question 2:</p>
                </>
              )}
            </>
          )}

          <a href="/login">Back to login</a>
        </div>
      </div>
    </>
  );
}
