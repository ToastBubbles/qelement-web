import axios from "axios";
import { CSSProperties, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import showToast, { Mode } from "../../../utils/utils";
import {
  IAPIResponse,
  IChangeUserRole,
  INodeWithID,
  ISuspendUser,
  ITitle,
  ITitleDTO,
  ITitlesToAddToUsers,
  IUserDTO,
  IUserTitlePackedDTO,
  user,
} from "../../../interfaces/general";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppContext } from "../../../context/context";
import LoadingPage from "../../../components/LoadingPage";
import X from "../../../components/X";
import CustomSelect from "../../../components/CustomSelect";

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
    public: true,
    requirement: "",
  });
  const [selectedTitleId, setSelectedTitleId] = useState<number | null>(-1);

  // const [isUserFound, setIsUserFound] = useState<boolean>(false);
  //   const [usernameOf, setIsUserFound] = useState<boolean>(false);

  const [tempUserCreds, setTempUserCreds] = useState<IUserCreds>({
    creds: "",
    type: "",
  });

  const [tempUser, setTempUser] = useState<IUserDTO | null>(null);

  const [usersToGiveTitle, setUsersToGiveTitle] = useState<
    ITitlesToAddToUsers[]
  >([]);

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

  const clearUserTextField = () => {
    setTempUserCreds((values) => ({
      ...values,
      ...{ creds: "", type: "" },
    }));
  };
  // useEffect(() => {
  //   if (
  //     (tempUserCreds.type == "email" || tempUserCreds.type == "username") &&
  //     tempUserCreds.creds.length > 0
  //   ) {
  //     console.log("useEffect is triggering refecth with the following values");
  //     console.log(tempUserCreds);

  //     userRefetch();
  //   }
  // }, [tempUserCreds, userRefetch]);
  const titleCreationMutation = useMutation({
    mutationFn: (data: ITitle) =>
      axios.post<IAPIResponse>(`http://localhost:3000/title/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (res) => {
      if (res.data.code == 200) {
        showToast("Title successfully", Mode.Success);
        setNewTitle({
          title: "",
          cssClasses: "",
          public: true,
          requirement: "",
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

  const userTitleCreationMutation = useMutation({
    mutationFn: (data: IUserTitlePackedDTO) =>
      axios.post<IAPIResponse>(`http://localhost:3000/userTitle/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (res) => {
      if (res.data.code == 201) {
        showToast("user titles successfully added", Mode.Success);
        setUsersToGiveTitle([]);
      } else {
        showToast(`Request failed with code ${res.data.code}`, Mode.Error);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const checkboxStyles: CSSProperties = {
    transform: "scale(1.5)", // Adjust the scale factor as needed
    marginRight: "8px", // Add some spacing if desired
  };
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
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="titlePub">Is this title Public?</label>
              <input
                name="titlePub"
                type="checkbox"
                className="formInput"
                style={checkboxStyles}
                checked={newTitle.public}
                onChange={(e) => {
                  setNewTitle((titleDTO) => ({
                    ...titleDTO,
                    ...{ public: e.target.checked },
                  }));
                }}
              ></input>
            </div>
            <div className="w-100 d-flex flex-col">
              <label htmlFor="titleReq">Requirement</label>
              <textarea
                rows={5}
                name="titleReq"
                placeholder="Unspecified"
                value={newTitle.requirement}
                onChange={(e) =>
                  setNewTitle((titleDTO) => ({
                    ...titleDTO,
                    ...{ requirement: e.target.value },
                  }))
                }
              ></textarea>
            </div>

            <div style={{ marginTop: "1em" }}>
              <button
                onClick={() => {
                  if (newTitle.title.length > 1) {
                    titleCreationMutation.mutate(newTitle);
                  }
                }}
              >
                Add
              </button>
            </div>
            <div className="fake-hr"></div>
            <h3>Grant Title to User</h3>
            <div className="w-100 d-flex">
              <input
                className="formInput w-50"
                placeholder="username"
                onChange={(e) => {
                  let mode = e.target.value.includes("@")
                    ? "email"
                    : "username";

                  setTempUserCreds((values) => ({
                    ...values,
                    ...{ creds: e.target.value.trim(), type: mode },
                  }));
                }}
                value={tempUserCreds.creds}
                onBlur={(e) => {
                  if (
                    (tempUserCreds.type == "email" ||
                      tempUserCreds.type == "username") &&
                    tempUserCreds.creds.length > 0
                  ) {
                    console.log(
                      "useEffect is triggering refecth with the following values"
                    );
                    console.log(tempUserCreds);

                    userRefetch();
                  }
                }}
              ></input>
              <div style={{ width: "40%", height: "1.75em" }}>
                <CustomSelect
                  customStyles={{ height: "100%" }}
                  setter={setSelectedTitleId}
                  options={getOptions(allTitles)}
                />
              </div>
              <button
                onClick={() => {
                  let selectedTitle = allTitles.find(
                    (x) => x.id == selectedTitleId
                  );
                  if (
                    selectedTitle &&
                    tempUser &&
                    canAddEntry(tempUser.id, selectedTitleId)
                  ) {
                    usersToGiveTitle.push({
                      user: tempUser,
                      title: selectedTitle,
                    });
                    setTempUser(null);
                    clearUserTextField();
                  }
                }}
                className="formInput"
                disabled={tempUser == null || selectedTitleId == -1}
              >
                Add
              </button>
            </div>
            <div className="w-100">
              {usersToGiveTitle.length > 0 && (
                <div
                  className="d-flex jc-space-b"
                  style={{ alignItems: "baseline" }}
                >
                  <span style={{ width: "50%" }}>User</span>
                  <span style={{ width: "45%" }}>Title</span>
                  <span style={{ fontSize: "0.55em", width: "5%" }}>
                    Remove
                  </span>
                </div>
              )}
              {usersToGiveTitle.map((userTitleObj) => {
                const handleRemoveUser = () => {
                  const updatedUsers = usersToGiveTitle.filter(
                    (obj) => obj !== userTitleObj
                  );
                  setUsersToGiveTitle(updatedUsers);
                };
                return (
                  <div
                    className="d-flex jc-space-b"
                    key={`${userTitleObj.user.id}-${userTitleObj.title.id}`}
                  >
                    <div style={{ width: "50%" }}>
                      <div>{userTitleObj.user.name}</div>
                      <div>{userTitleObj.user.email}</div>
                    </div>
                    <div
                      className={userTitleObj.title.cssClasses}
                      style={{ width: "45%" }}
                    >
                      {userTitleObj.title.title}
                    </div>
                    <div style={{ width: "5%", position: "relative" }}>
                      <X fn={handleRemoveUser} />
                    </div>
                  </div>
                );
              })}

              {usersToGiveTitle.length > 0 && (
                <div className="d-flex jc-end" style={{ paddingTop: "1em" }}>
                  <button
                    onClick={() => {
                      userTitleCreationMutation.mutate({
                        array: usersToGiveTitle,
                      });
                    }}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  } else return <LoadingPage />;

  function getOptions(usersTitles: ITitleDTO[]): INodeWithID[] {
    if (usersTitles.length == 0) return [];

    let output: INodeWithID[] = [];

    usersTitles.forEach((title) =>
      output.push({
        node: <span className={title.cssClasses}>{title.title}</span>,
        id: title.id,
      })
    );
    return output;
  }

  function canAddEntry(userId: number, titleId: number | null): boolean {
    if (titleId == null) return false;
    if (usersToGiveTitle.length == 0) return true;

    const existingEntry = usersToGiveTitle.find(
      (x) => x.user.id == userId && x.title.id == titleId
    );

    if (existingEntry)
      showToast("This user/title combination already exists!", Mode.Error);
    return !existingEntry;
  }
}
