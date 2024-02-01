import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import showToast, { Mode } from "../../../utils/utils";
import {
  IAPIResponse,
  IChangeUserRole,
  ISuspendUser,
  ITitle,
  ITitleDTO,
  IUserDTO,
  user,
} from "../../../interfaces/general";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppContext } from "../../../context/context";
import LoadingPage from "../../../components/LoadingPage";

interface IUserCreds {
  creds: string;
  type: string; //email or username
}

export default function TitleManagementView() {
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);
  const [newTitle, setNewTitle] = useState<ITitle>({
    title: "",
    cssClasses: "",
  });
  const [selectedTitleId, setSelectedTitleId] = useState<number>(-1);

  const [isUserFound, setIsUserFound] = useState<boolean>(false);
  //   const [usernameOf, setIsUserFound] = useState<boolean>(false);

  const [tempUserCreds, setTempUserCreds] = useState<IUserCreds>({
    creds: "",
    type: "",
  });

  const [tempUser, setTempUser] = useState<IUserDTO | null>(null);

  const [usersToGiveTitle, setUsersToGiveTitle] = useState<IUserDTO[] | null>(
    null
  );

  const { data: allTitleData, refetch: titleRefetch } = useQuery({
    queryKey: "allTitles",
    queryFn: () => axios.get<ITitleDTO[]>(`http://localhost:3000/title/all`),
  });

  const { refetch: userRefetch } = useQuery({
    queryKey: "user-" + tempUserCreds.creds,
    queryFn: () =>
      axios.get<IUserDTO | IAPIResponse>(
        `http://localhost:3000/user/${tempUserCreds.type}/${tempUserCreds.creds}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),

    onSuccess(resp) {
      if ("code" in resp.data) {
        const apiResponse = resp.data as IAPIResponse;
        showToast(`User not found!`, Mode.Error);
        if (tempUser != null) setTempUser(null);
      } else {
        showToast(`Found user!`, Mode.Success);
        setTempUser(resp.data as IUserDTO);
      }
    },
    enabled: false,
  });
  useEffect(() => {
    if (
      (tempUserCreds.type == "email" || tempUserCreds.type == "username") &&
      tempUserCreds.creds.length > 0
    ) {
      console.log("useEffect is triggering refecth with the following values");
      console.log(tempUserCreds);

      userRefetch();
    }
  }, [tempUserCreds, userRefetch]);
  const titleCrationMutation = useMutation({
    mutationFn: (data: ITitle) =>
      axios.post<IAPIResponse>(`http://localhost:3000/title/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    // .then((res) => {
    //   console.log(res.data);
    //   if (res.data.code == 200) {
    //     showToast("Title successfully", Mode.Success);
    //   } else {
    //     showToast(`Request failed with code ${res.data.code}`, Mode.Error);
    //   }
    // })
    // .catch((err) => console.log(err)),
    onSuccess: (res) => {
      if (res.data.code == 200) {
        showToast("Title successfully", Mode.Success);
        setNewTitle({
          title: "",
          cssClasses: "",
        });
        titleRefetch();
      } else {
        showToast(`Request failed with code ${res.data.code}`, Mode.Error);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  if (allTitleData) {
    const allTitles = allTitleData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>Manage Titles</h1>

          <div className="mainform">
            <h3>Create New Title</h3>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="title">Title</label>
              <input
                className="formInput"
                name="title"
                placeholder="Title"
                value={newTitle.title}
                onChange={(e) =>
                  setNewTitle((titleDTO) => ({
                    ...titleDTO,
                    ...{ title: e.target.value },
                  }))
                }
              ></input>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="titleCSS">CSS Class Names</label>
              <input
                className="formInput"
                name="titleCSS"
                placeholder="Class Names"
                value={newTitle.cssClasses}
                onChange={(e) =>
                  setNewTitle((titleDTO) => ({
                    ...titleDTO,
                    ...{ cssClasses: e.target.value },
                  }))
                }
              ></input>
            </div>
            <button
              onClick={() => {
                if (newTitle.title.length > 1) {
                  titleCrationMutation.mutate(newTitle);
                }
              }}
            >
              Add
            </button>
            <div className="fake-hr"></div>
            <h3>Grant Title to User</h3>
            <div className="w-100 d-flex jc-space-b">
              <input
                className="formInput w-50"
                placeholder="username"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                  }
                }}
                onBlur={(e) => {
                  // getRecipientId(e.target.value)
                  if (e.target.value.length > 1) {
                    let mode = e.target.value.includes("@")
                      ? "email"
                      : "username";

                    setTempUserCreds((values) => ({
                      ...values,
                      ...{ creds: e.target.value.trim(), type: mode },
                    }));
                  }
                  //    &&
                  //     getUser(
                  //       e.target.value.trim(),
                  //       e.target.value.includes("@") ? "email" : "username"
                  //     );
                }}
              ></input>
              <select
                className="formInput w-50"
                name="title"
                id="title-select"
                onChange={(e) => setSelectedTitleId(Number(e.target.value))}
                value={selectedTitleId}
              >
                <option value={-1}>--</option>
                {allTitles.map((titleObj) => (
                  <option
                    key={titleObj.id}
                    value={titleObj.id}
                    className={titleObj.cssClasses}
                  >
                    {titleObj.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              //   onClick={() => refetchUser()}
              disabled={tempUser == null}
            >
              Add
            </button>
          </div>
        </div>
      </>
    );
  } else return <LoadingPage />;
}
