import { useContext, useState } from "react";
import { AppContext } from "../../../context/context";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import axios from "axios";
import { IAPIResponse, user } from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";

export default function OtherUserProfileView() {
  const {
    state: {
      jwt: { payload },
    },
  } = useContext(AppContext);

  const [isUsernameBad, setIsUsernameBad] = useState<boolean>(false);

  const { username } = useParams();

  //   const { data: userData, refetch } = useQuery(
  //     "getID",
  //     () => {
  //       try {
  //         if (username && username.length > 1) {
  //           axios
  //             .get<user | IAPIResponse>(
  //               `http://localhost:3000/user/username/${username.trim()}`
  //             )
  //             .then((res) => {
  //               if ("code" in res.data && res.data?.code == 404) {
  //                 showToast("Recipient does not exist", Mode.Error);
  //                 setIsUsernameBad(true);
  //               } else if ("id" in res.data) {
  //                 // let data = res.data as user;
  //                 console.log(res.data);

  //                 setIsUsernameBad(false);
  //               }
  //             });
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     },
  //     {
  //       enabled: !!username,
  //     }
  //   );

  const { data: userData } = useQuery({
    queryKey: "isAdmin",
    queryFn: () =>
      axios.get<user | IAPIResponse>(
        `http://localhost:3000/user/username/${username?.trim()}`
      ),
    onSuccess: (resp) => {
      if ("code" in resp.data && resp.data?.code == 404) {
        showToast("Recipient does not exist", Mode.Error);
        setIsUsernameBad(true);
      } else if ("id" in resp.data) {
        // let data = res.data as user;
        console.log(resp.data);

        setIsUsernameBad(false);
      }
    },
    retry: false,
    // refetchInterval: 30000,
    enabled: !!username,
  });
  console.log(username);
  console.log(userData);
  console.log(isUsernameBad);

  if (username && userData && !isUsernameBad)
    return (
      <>
        <div className="mx-w">
          <h1>profile for {username}</h1>
          <div className="d-flex profile-btn-container"></div>
        </div>
      </>
    );
  else if (isUsernameBad)
    return (
      <>
        <div className="mx-w">
          <p>User does not exist!</p>
        </div>
      </>
    );
  else
    return (
      <>
        <div className="mx-w">
          <p>Loading user...</p>
        </div>
      </>
    );
}
