import { ReactNode, useContext, useState } from "react";
import { AppContext } from "../../../context/context";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import axios from "axios";
import {
  IAPIResponse,
  IQPartDTOInclude,
  IUserDTO,
  IWantedDTOGET,
  user,
} from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import TopFiveCard from "../../../components/TopFiveCard";

export default function OtherUserProfileView() {
  const {
    state: {
      jwt: { payload },
    },
  } = useContext(AppContext);

  const [isUsernameBad, setIsUsernameBad] = useState<boolean>(false);

  const { username } = useParams();

  const { data: userData } = useQuery({
    queryKey: `user${username}`,
    queryFn: () =>
      axios.get<IUserDTO | IAPIResponse>(
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

  console.log(userData?.data);

  function getTopFive(
    favoriteParts: IQPartDTOInclude[] | undefined,
    user: IUserDTO
  ): ReactNode {
    if (!user.preferences.isWantedVisible)
      return <p>{user.name} has their favorite parts privated.</p>;
    const noPartsNode = (
      <p>{user.name} does not have any Top Five parts listed!</p>
    );
    if (favoriteParts == undefined || favoriteParts.length == 0)
      return noPartsNode;

    let topfive: IQPartDTOInclude[] = [];
    favoriteParts.forEach((part) => {
      if (part.UserFavorite) {
        if (part.UserFavorite.type == "topfive") {
          topfive.push(part);
        }
      }
    });
    if (topfive.length == 0) return noPartsNode;

    return topfive.map((qpart) => {
      if (qpart.UserFavorite) {
        let conversion: IWantedDTOGET = {
          userId: qpart.UserFavorite.userId,
          id: qpart.UserFavorite.id,
          type: "topfive",
          qpart: qpart,
        };
        return <TopFiveCard key={qpart.id} myWantedPart={conversion} />;
      }
    });
  }

  if (username && userData && !isUsernameBad) {
    let user = userData.data as IUserDTO;
    return (
      <>
        <div className="mx-w">
          <h1>profile for {username}</h1>
          <div className="topfive-container">
            {getTopFive(user.favoriteQParts, user)}
            {/* {user.favoriteQParts && user.favoriteQParts.length > 0 ? (
              user.favoriteQParts.map((qpart) => {
                if(qpart.UserFavorite && qpart.){
                let conversion: IWantedDTOGET = {
                  userId: user.id,
                  id: qpart.UserFavorite.id,
                  type: qpart.UserFavorite.type,
                  qpart: qpart,
                };
                return <TopFiveCard key={qpart.id} myWantedPart={conversion} />;}
              })
            ) : (
              <p>You don't have anything in your Top Five!</p>
            )} */}
          </div>
        </div>
      </>
    );
  } else if (isUsernameBad)
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
