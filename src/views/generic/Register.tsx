import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  IAPIResponse,
  IPredefinedSecQuestionDTO,
  ISecurityQuestionDTO,
  IUserCreationDTO,
  IUserDTO,
  IUserWSecQDTO,
  passwordValidation,
} from "../../interfaces/general";
import showToast, { Mode } from "../../utils/utils";
import LoadingPage from "../../components/LoadingPage";
import ColorTextField from "../../components/ColorTextField";

export default function Register() {
  const defaultQuestion: ISecurityQuestionDTO = {
    questionId: -1,
    answer: "",
  };
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState<IUserCreationDTO>({
    name: "",
    email: "",
    password: "",
  });
  const [faveColorId, setFaveColorId] = useState<number | null>(null);
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

  function verifySecurityQuestions(): boolean {
    if (
      question1.questionId == -1 ||
      question2.questionId == -1 ||
      question3.questionId == -1 ||
      question1.answer.length < 4 ||
      question2.answer.length < 4 ||
      question3.answer.length < 4
    ) {
      return false;
    }
    return true;
  }

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
                  verifySecurityQuestions() &&
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
                    name: newUser.name,
                    email: newUser.email,
                    password: newUser.password,
                    favoriteColorId: faveColorId,
                    q1: question1,
                    q2: question2,
                    q3: question3,
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
    mutationFn: (userDTO: IUserWSecQDTO) =>
      axios.post<IUserWSecQDTO>(`http://localhost:3000/user/register`, userDTO),
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
      if (otherQA != -1) {
        const indexToRemove = output.findIndex((x) => x.id === otherQA);
        if (indexToRemove !== -1) {
          output.splice(indexToRemove, 1);
        }
      }
      if (otherQB != -1) {
        const indexToRemove = output.findIndex((x) => x.id === otherQB);
        if (indexToRemove !== -1) {
          output.splice(indexToRemove, 1);
        }
      }

      return output;
    }
    const isValidUsername = (input: string): boolean => {
      return /^[a-zA-Z0-9.-_]+$/.test(input);
    };
    return (
      <>
        <div className="formcontainer">
          <h1>register</h1>
          <div className="mainform">
            <input
              maxLength={20}
              placeholder="Username"
              style={{ marginBottom: "0.5em" }}
              onChange={(e) =>
                setNewUser((newUser) => ({
                  ...newUser,
                  ...{ name: e.target.value },
                }))
              }
            />
            <small>
              Username can only contain letters, numbers, periods (.), or
              underscores (_)
            </small>
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
            <h3>Favorite LEGO Color</h3>
            <ColorTextField setter={setFaveColorId} placeholder="Optional" />

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
              <option key={-1} value={-1}>
                -Question 1-
              </option>
              {GetUnusedQuestions(1).map((q) => (
                <option key={q.id} value={q.id}>
                  {q.question}
                </option>
              ))}
            </select>
            <input
              id="answer1"
              placeholder="Answer 1"
              type="text"
              onChange={(e) =>
                setQuestion1((question1) => ({
                  ...question1,
                  ...{ answer: e.target.value },
                }))
              }
            />
            <p>
              - must be at least 4 characters long
              {question1.answer.length >= 4 ? "✔️" : "❌"}
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
              <option key={-1} value={-1}>
                -Question 2-
              </option>
              {GetUnusedQuestions(2).map((q) => (
                <option key={q.id} value={q.id}>
                  {q.question}
                </option>
              ))}
            </select>
            <input
              id="answer2"
              placeholder="Answer 2"
              type="text"
              onChange={(e) =>
                setQuestion2((question2) => ({
                  ...question2,
                  ...{ answer: e.target.value },
                }))
              }
            />
            <p>
              - must be at least 4 characters long
              {question2.answer.length >= 4 ? "✔️" : "❌"}
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
              <option key={-1} value={-1}>
                -Question 3-
              </option>
              {GetUnusedQuestions(3).map((q) => (
                <option key={q.id} value={q.id}>
                  {q.question}
                </option>
              ))}
            </select>
            <input
              id="answer3"
              placeholder="Answer 3"
              type="text"
              onChange={(e) =>
                setQuestion3((question3) => ({
                  ...question3,
                  ...{ answer: e.target.value },
                }))
              }
            />
            <p>
              - must be at least 4 characters long
              {question3.answer.length >= 4 ? "✔️" : "❌"}
            </p>

            <button
              onClick={() => {
                if (isValidUsername(newUser.name.trim())) {
                  refecthUsernameAvailability();
                } else {
                  showToast(
                    "Username can only contain letters, numbers, periods (.), or underscores (_)!",
                    Mode.Error
                  );
                }
              }}
            >
              Register
            </button>
            <div>
              By registering for an account, you agree to the{" "}
              <Link className="link" to={"/terms"}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
