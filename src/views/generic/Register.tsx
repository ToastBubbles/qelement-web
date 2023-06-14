import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";
import { IUserDTO, user } from "../../interfaces/general";
import { IQelementError } from "../../interfaces/error";
import showToast, { Mode } from "../../utils/utils";
import { Link } from "react-router-dom";

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

  const { refetch: refecthUsernameAvailability } = useQuery(
    "checkUser",
    () => {
      try {
        if (newUser.name.length > 1) {
          axios
            .get<user | IQelementError>(
              `http://localhost:3000/user/checkInsensitive/${newUser.name.trim()}`
            )
            .then((res) => {
              console.log(res.data);

              if (res.data?.message == "not found") {
                if (
                  passMatch == newUser.password &&
                  passValidate?.containsLetter &&
                  passValidate?.containsNumber &&
                  passValidate?.isLongEnough &&
                  newUser.email.length > 5 &&
                  newUser.email.includes("@")
                ) {
                  userMutation.mutate({
                    name: newUser.name,
                    email: newUser.email,
                    password: newUser.password,
                    role: newUser.role,
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

  // async function submitInfo() {
  //   refecthUsernameAvailability().then(() => {
  //     if (
  //       passMatch == newUser.password &&
  //       passValidate?.containsLetter &&
  //       passValidate?.containsNumber &&
  //       passValidate?.isLongEnough &&
  //       usernameAvailable
  //     ) {
  //       userMutation.mutate({
  //         name: newUser.name,
  //         email: newUser.email,
  //         password: newUser.password,
  //         role: newUser.role,
  //       });
  //       navigate("/login");
  //     } else {
  //       if (!usernameAvailable) {
  //         showToast("Username is already taken", Mode.Warning);
  //       } else {
  //         showToast("Error creating account", Mode.Error);
  //       }
  //     }
  //   });
  // }

  return (
    <>
      <div className="formcontainer">
        <h1>register</h1>
        <div className="mainform">
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
              - at least 8 characters {passValidate?.isLongEnough ? "✔️" : "❌"}
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
          <button
            onClick={() => {
              // checkUsername(newUser.name).then((result) => {
              // if (result) {
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
}
