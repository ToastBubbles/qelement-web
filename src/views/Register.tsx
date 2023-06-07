import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { IUserDTO } from "../interfaces/general";

interface passwordValidation {
  isLongEnough: boolean;
  containsNumber: boolean;
  containsLetter: boolean;
}

export default function Register() {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState<IUserDTO>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [passValidate, setPassValidate] = useState<passwordValidation>({
    isLongEnough: false,
    containsNumber: false,
    containsLetter: false,
  });
  const [passMatch, setPassMatch] = useState<string>();

  const userMutation = useMutation({
    mutationFn: (userDTO: IUserDTO) =>
      axios.post<IUserDTO>(`http://localhost:3000/user`, userDTO),
    onSuccess: () => {},
  });
  return (
    <>
      <div className="maincontainer">
        <div className="logincontainer">
          <h1>register</h1>
          <div className="loginRegForm">
            <input
              placeholder="Username"
              onChange={(e) =>
                setNewUser((newUser) => ({
                  ...newUser,
                  ...{ name: e.target.value },
                }))
              }
            />
            <input
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
              id="password-reg"
              placeholder="Password"
              type="password"
              onChange={(e) => {
                let lengthBool = e.target.value.length >= 8;
                let regexpLet = new RegExp(".*[a-zA-Z].*");
                let regexpNum = new RegExp(".*[1-9,0].*");
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
              - re-entered password matches{" "}
              {passMatch == newUser.password ? "✔️" : "❌"}
            </p>
            <button
              onClick={() => {
                // checkUsername(newUser.name).then((result) => {
                // if (result) {
                if (
                  passMatch == newUser.password &&
                  passValidate?.containsLetter &&
                  passValidate?.containsNumber &&
                  passValidate?.isLongEnough
                ) {
                  userMutation.mutate({
                    name: newUser.name,
                    email: newUser.email,
                    password: newUser.password,
                    role: newUser.role,
                  });
                  navigate("/login");
                }
                // } else {
                //   alert("Username already exists!");
                // }
                // });
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
