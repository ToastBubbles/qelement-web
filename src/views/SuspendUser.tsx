import axios from "axios";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import showToast, { Mode } from "../utils/utils";
import { IAPIResponse, ISuspendUser, user } from "../interfaces/general";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDistance } from "date-fns";
import { AppContext } from "../context/context";
export default function SuspendUser() {
  const {
    state: {
      jwt: { payload },
    },
  } = useContext(AppContext);
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientId, setRecipientId] = useState<number>(-1);
  const [suspensionType, setSuspensionType] = useState<string>("suspension");
  const [isUserFound, setIsUserFound] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isFinal, setIsFinal] = useState<boolean>(false);
  const {
    data: recipID,
    isLoading,
    error,
    isFetched,
    refetch: refetchUser,
  } = useQuery(
    "getID",
    () => {
      try {
        if (recipientName.length > 1) {
          console.log("calling api with", recipientName);
          axios
            .get<user | IAPIResponse>(
              `http://localhost:3000/user/username/${recipientName.trim()}`
            )
            .then((res) => {
              if ("code" in res.data && res.data?.code == 404) {
                showToast("Recipient does not exist", Mode.Error);
                setIsUserFound(false);
              } else if ("id" in res.data) {
                let data = res.data as user;
                console.log(res.data);

                setIsUserFound(true);
                setRecipientId(data.id);
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
  const banMutation = useMutation({
    mutationFn: (data: ISuspendUser) =>
      axios
        .post<IAPIResponse>(`http://localhost:3000/users/suspend`, { data })
        .then((res) => {
          console.log(res.data);
          if (res.data.code == 200) {
            showToast("Request completed successfully", Mode.Success);
          } else {
            showToast(`Request failed with code ${res.data.code}`, Mode.Error);
          }
        })
        .catch((err) => console.log(err)),
    onSuccess: (resp) => {
      // refetch();
      // showToast("Category approved!", Mode.Success);
    },
  });
  const calculateSuspensionDuration = () => {
    const currentDate: Date = new Date();
    const endDate: Date = new Date(startDate);

    // Calculate the difference in milliseconds
    const differenceInMs: number = endDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const differenceInDays: number = Math.ceil(
      differenceInMs / (1000 * 60 * 60 * 24)
    );
    console.log(differenceInDays);

    let years = Math.floor(differenceInDays / 365);
    let months = Math.floor((differenceInDays - years * 365) / 30);
    let days = differenceInDays - years * 365 - months * 30;
    let output = years == 1 ? `1 year, ` : "";
    years > 1 ? (output += `${years} years, `) : "";
    months == 1 ? (output += `1 month, `) : "";
    months > 1 ? (output += `${months} months, `) : "";
    days == 1 ? (output += `1 day`) : "";
    days > 1 ? (output += `${days} days`) : "";
    output = output.trim();
    if (output.endsWith(",")) {
      output = output.slice(0, -1);
    }
    return output;
  };
  return (
    <>
      <div className="formcontainer">
        <h1>Suspend User</h1>

        <div className="mainform">
          {!isUserFound ? (
            <>
              <input
                // className={"" + (isBadRecipient ? " bad-recipient" : "")}
                onChange={(e) => setRecipientName(e.target.value)}
              ></input>
              <button onClick={() => refetchUser()}>Check Username</button>
            </>
          ) : !isFinal ? (
            <>
              <h4>Account suspension for user:</h4>
              <h2>{recipientName}</h2>
              <select
                value={suspensionType}
                onChange={(e) => {
                  setSuspensionType(e.target.value);
                }}
              >
                <option value={"suspension"}>suspend</option>
                <option value={"ban"}>ban</option>
                <option value={"ban removal"}>remove ban/suspension</option>
              </select>
              {suspensionType != "ban" ? (
                <div className="d-flex flex-col ai-center">
                  Suspend until
                  <DatePicker
                    className="formInput center-text"
                    selected={startDate}
                    onChange={(date) => {
                      if (date != null) setStartDate(date);
                    }}
                  />
                  <p>{calculateSuspensionDuration()}</p>
                </div>
              ) : (
                <></>
              )}
              <button
                onClick={() => {
                  setIsFinal(true);
                }}
              >
                Submit
              </button>
            </>
          ) : (
            <div className="d-flex flex-col ai-center">
              <h4>Confirm {suspensionType} for user:</h4>
              <h2>{recipientName}</h2>
              {suspensionType != "ban" ? (
                <p>until {startDate.toDateString()}</p>
              ) : (
                <></>
              )}
              <button
                onClick={() => {
                  banMutation.mutate({
                    type: suspensionType,
                    untilDate: startDate.toDateString(),
                    reason: "string",
                    userId: recipientId,
                    adminId: payload.id,
                  });
                }}
              >
                Finalize
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
  //   } else return <p>Loading...</p>;
}
