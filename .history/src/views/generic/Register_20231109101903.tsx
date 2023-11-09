import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  IAPIResponse,
  IPredefinedSecQuestionDTO,
  ISecurityQuestionDTO,
  IUserDTO,
} from "../../interfaces/general";
import showToast, { Mode } from "../../utils/utils";
import LoadingPage from "../../components/LoadingPage";

interface passwordValidation {
  isLongEnough: boolean;
  containsNumber: boolean;
  containsLetter: boolean;
}

export default function Register() {
  const defaultQuestion: ISecurityQuestionDTO = {
    questionId: -1,
    answer: "",
  };
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState<IUserDTO>({
    id: -1,
    name: "",
    email: "",
    password: "",
    role: "user",
    createdAt: "",
  });
  const [question1, setQuestion1] =
    useState<ISecurityQuestionDTO>(defaultQuestion);
  const [question2, setQuestion2] =
    useState<ISecurityQuestionDTO>(defaultQuestion);
  const [question3, setQuestion3] =
    useState<ISecurityQuestionDTO>(defaultQuestion);
  const [passValidate, setPassValidate] = useState<passwordValidation>({
    isLongEnough: false,
    containsNumber: false,
    containsLetter: false,
  });

  const { data: questionData } = useQuery("secQuestions", () =>
    axios.get<IPredefinedSecQuestionDTO[]>(
      `http://localhost:3000/predefinedSecurityQuestion`
    )
  );

  const [passMatch, setPassMatch] = useState<string>();

  const { refetch: refecthUsernameAvailability } = useQuery(
    "checkUser",
    () => {
      try {
        if (newUser.name.length > 1) {
          axios
            .get<IAPIResponse>(
              `http://localhost:3000/user/checkInsensitive/${newUser.name.trim()}`
            )
            .then((res) => {
              if (res.data?.code == 404) {
                if (
                  passMatch == newUser.password &&
                  passValidate?.containsLetter &&
                  passValidate?.containsNumber &&
                  passValidate?.isLongEnough &&
                  newUser.email.length > 5 &&
                  newUser.email.length <= 255 &&
                  newUser.password.length <= 30 &&
                  newUser.name.length <= 20 &&
                  newUser.email.includes("@")
                ) {
                  userMutation.mutate({
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    password: newUser.password,
                    role: newUser.role,
                    createdAt: newUser.createdAt,
                  });
                  navigate("/login");
                } else {
                  showToast("Error creating account", Mode.Error);
                }
              } else {
                showToast("Username is already taken", Mode.Warning);
              }
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
    {
      staleTime: 100,
      enabled: false,
    }
  );

  const userMutation = useMutation({
    mutationFn: (userDTO: IUserDTO) =>
      axios.post<IUserDTO>(`http://localhost:3000/user`, userDTO),
    onSuccess: () => {
      showToast("Account successfully created!", Mode.Success);
    },
  });

  if (questionData) {
    let questions = questionData.data;
    function GetUnusedQuestions(field: number): IPredefinedSecQuestionDTO[] {
      let otherQA = -1;
      let otherQB = -1;
      if (field == 1) {
        otherQA = question2.questionId;
        otherQB = question3.questionId;
      } else if (field == 2) {
        otherQA = question1.questionId;
        otherQB = question3.questionId;
      } else {
        otherQA = question1.questionId;
        otherQB = question2.questionId;
      }

      let output = [...questions];
      if (otherQA != -1){
        output.find(x => x.questionId == otherQA);
      } 
      return output;
    }
    return (
      <>
        <div className="formcontainer">
          <h1>register</h1>
          <div className="mainform">
            <input
              maxLength={20}
              placeholder="Username"
              onChange={(e) =>
                setNewUser((newUser) => ({
                  ...newUser,
                  ...{ name: e.target.value },
                }))
              }
            />
            <input
              maxLength={255}
              placeholder="Email"
              type="email"
              onChange={(e) =>
                setNewUser((newUser) => ({
                  ...newUser,
                  ...{ email: e.target.value },
                }))
              }
            />
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

                setNewUser((newUser) => ({
                  ...newUser,
                  ...{ password: e.target.value },
                }));
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
              {passMatch == newUser.password ? "✔️" : "❌"}
            </p>
            <h3>Security Questions</h3>

            <select
              name="q1"
              id="q1"
              className="reg-dropdown"
              onChange={(e) =>
                setQuestion1((question1) => ({
                  ...question1,
                  ...{ questionId: Number(e.target.value) },
                }))
              }
              value={question1.questionId}
            >
              <option key={-1} value="-1">
                -Question 1-
              </option>
              {getUnique(qparts).map((mold) => (
                <option key={mold.id} value={`${mold.id}`}>
                  {mold.number}
                </option>
              ))}
            </select>
            <input
              id="repassword-reg"
              placeholder="Answer 1"
              type="password"
              onChange={(e) => setPassMatch(e.target.value)}
            />
            <p>
              - must be at least 4 characters long
              {passMatch == newUser.password ? "✔️" : "❌"}
            </p>
            <select
              name="q2"
              id="q2"
              className="reg-dropdown"
              onChange={(e) =>
                setQuestion2((question2) => ({
                  ...question2,
                  ...{ questionId: Number(e.target.value) },
                }))
              }
              value={question2.questionId}
            >
              <option key={-1} value="-1">
                -Question 2-
              </option>
              {/* {getUnique(qparts).map((mold) => (
                      <option key={mold.id} value={`${mold.id}`}>
                        {mold.number}
                      </option>
                    ))} */}
            </select>
            <input
              id="repassword-reg"
              placeholder="Answer 2"
              type="password"
              onChange={(e) => setPassMatch(e.target.value)}
            />
            <p>
              - must be at least 4 characters long
              {passMatch == newUser.password ? "✔️" : "❌"}
            </p>
            <select
              name="q3"
              id="q3"
              className="reg-dropdown"
              onChange={(e) =>
                setQuestion3((question3) => ({
                  ...question3,
                  ...{ questionId: Number(e.target.value) },
                }))
              }
              value={question3.questionId}
            >
              <option key={-1} value="-1">
                -Question 3-
              </option>
              {/* {getUnique(qparts).map((mold) => (
                      <option key={mold.id} value={`${mold.id}`}>
                        {mold.number}
                      </option>
                    ))} */}
            </select>
            <input
              id="repassword-reg"
              placeholder="Answer 3"
              type="password"
              onChange={(e) => setPassMatch(e.target.value)}
            />
            <p>
              - must be at least 4 characters long
              {passMatch == newUser.password ? "✔️" : "❌"}
            </p>

            <button
              onClick={() => {
                refecthUsernameAvailability();
              }}
            >
              Register
            </button>
            <div>
              By registering for an account, you agree to the{" "}
              <Link to={"/terms"}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
