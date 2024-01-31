import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  IAPIResponse,
  ISecurityQuestionDTO,
  IUserRecoveryDTO,
  passwordValidation,
} from "../../interfaces/general";
import { AppContext } from "../../context/context";
import { useQuery } from "react-query";
import axios from "axios";
import showToast, { Mode } from "../../utils/utils";

export default function ForgotPassword() {
  const {
    state: {
      jwt: { token },
    },
  } = useContext(AppContext);
  const [validated, setValidation] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [answer1, setAnswer1] = useState<string>("");
  const [answer2, setAnswer2] = useState<string>("");
  const [passMatch, setPassMatch] = useState<string>();
  // const [answer3, setAnswer3] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [passValidate, setPassValidate] = useState<passwordValidation>({
    isLongEnough: false,
    containsNumber: false,
    containsLetter: false,
  });

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
            `http://localhost:3000/user/getQuestions/${email.trim()}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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

      return resp.data;
    },
    {
      enabled: false,
    }
  );
  const {
    data: q2APIResponse,

    refetch: q2Refetch,
  } = useQuery(
    "q2",
    async () => {
      let id = -1;
      if (userData && "name" in userData) {
        id = (userData as IUserRecoveryDTO).securityQuestions[1].id;
      }
      const resp = await axios.post<IAPIResponse>(
        "http://localhost:3000/securityQuestion/check",
        { questionId: id, answer: answer2 } as ISecurityQuestionDTO
      );

      return resp.data;
    },
    {
      enabled: false,
    }
  );
  // const { data: q3APIResponse, refetch: q3Refetch } = useQuery(
  //   "q1",
  //   async () => {
  //     let id = -1;
  //     if (userData && "name" in userData) {
  //       id = (userData as IUserRecoveryDTO).securityQuestions[2].id;
  //     }
  //     const resp = await axios.post<IAPIResponse>(
  //       "http://localhost:3000/securityQuestion/check",
  //       { questionId: id, answer: answer3 } as ISecurityQuestionDTO
  //     );
  //     if (resp.data.code != 200) {
  //       showToast("Incorrect answer!", Mode.Error);
  //     }
  //     console.log(resp.data);

  //     return resp.data;
  //   },
  //   {
  //     enabled: false,
  //   }
  // );
  async function getCorrectness() {
    try {
      const [q1Res, q2Res] = await Promise.all([q1Refetch(), q2Refetch()]);

      const is1Good = q1Res.data?.code === 200;
      const is2Good = q2Res.data?.code === 200;

      if (is1Good && is2Good) {
        setValidation(true);
      } else {
        showToast("One or more answer is incorrect!", Mode.Error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error as needed
    }
  }
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    refetchEmail();
                  }
                }}
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
              {!validated ? (
                <>
                  <p>Question 1:</p>
                  <p>
                    {userData.securityQuestions[0].predefinedQuestion.question}
                  </p>
                  <input
                    placeholder="Answer"
                    type="text"
                    id="a1"
                    value={answer1}
                    onChange={(e) => setAnswer1(e.target.value.toLowerCase())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        q1Refetch();
                      }
                    }}
                  />
                  <p>Question 2:</p>
                  <p>
                    {userData.securityQuestions[1].predefinedQuestion.question}
                  </p>
                  <input
                    placeholder="Answer"
                    type="text"
                    id="a2"
                    value={answer2}
                    onChange={(e) => setAnswer2(e.target.value.toLowerCase())}
                  />
                  <p>(These answers are not case-sensitive)</p>

                  <button
                    onClick={() => {
                      getCorrectness();
                      //   attemptLogin(loginDTO);
                    }}
                  >
                    Submit
                  </button>
                </>
              ) : (
                <>
                  <p>Enter new password</p>
                  <input
                    maxLength={30}
                    id="password-reg"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => {
                      const lengthBool = e.target.value.length >= 8;
                      const regexpLet = new RegExp(".*[a-zA-Z].*");
                      const regexpNum = new RegExp(".*[1-9,0].*");
                      setPassValidate({
                        isLongEnough: lengthBool,
                        containsLetter: regexpLet.test(e.target.value),
                        containsNumber: regexpNum.test(e.target.value),
                      });

                      setNewPassword(e.target.value);
                    }}
                  />

                  <ul className="pass-req">
                    <li>
                      - at least 8 characters{" "}
                      {passValidate?.isLongEnough ? "✔️" : "❌"}
                    </li>
                    <li>
                      - contain at least one number{" "}
                      {passValidate?.containsNumber ? "✔️" : "❌"}
                    </li>
                    <li>
                      - contain at least one letter{" "}
                      {passValidate?.containsLetter ? "✔️" : "❌"}
                    </li>
                  </ul>

                  <input
                    id="repassword-reg"
                    placeholder="Re-Enter Password"
                    type="password"
                    onChange={(e) => setPassMatch(e.target.value)}
                  />
                  <p>
                    - re-entered password matches
                    {passMatch == newPassword ? "✔️" : "❌"}
                  </p>
                  <button
                    onClick={() => {
                      //   attemptLogin(loginDTO);
                    }}
                  >
                    Submit
                  </button>
                </>
              )}
            </>
          )}

          <Link className="link" to="/login">
            Back to login
          </Link>
        </div>
      </div>
    </>
  );
}
