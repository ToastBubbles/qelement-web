import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { AppContext } from "../../../context/context";
import { IAPIResponse, user } from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import { useNavigate } from "react-router";

export default function UserLookupView() {


  const [usernameText, setUsernameText] = useState<string>("");

  const [foundUser, setFoundUser] = useState<user | undefined>(undefined);

  //   const {
  //     state: {
  //       jwt: { token, payload },
  //     },
  //   } = useContext(AppContext);
  const navigate = useNavigate();

  const { data: recipID, refetch: refetchUser } = useQuery(
    "getID",
    () => {
      try {
        if (usernameText.length > 1) {
          axios
            .get<user | IAPIResponse>(
              `http://localhost:3000/user/username/${usernameText.trim()}`
            )
            .then((res) => {
              if ("code" in res.data && res.data?.code == 404) {
                showToast("Recipient does not exist", Mode.Error);
                setFoundUser(undefined);
              } else if ("id" in res.data) {
                let data = res.data as user;
                setFoundUser(data);
                navigate(`/profile/${data.name}`);
              }
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
    {
      enabled: false,
    }
  );

  return (
    <>
      <div className="formcontainer">
        <h1>user lookup</h1>
        <div className="mainform">
          <h3>enter username of the user you wish to find</h3>
          <div className="w-100 d-flex jc-center">
            <input
              className="formInput"
              onChange={(e) => {
                setUsernameText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  refetchUser();
                }
              }}
            ></input>
            <button
              className="formInput"
              onClick={() => {
                refetchUser();
              }}
            >
              Lookup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
