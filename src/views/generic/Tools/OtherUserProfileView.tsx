import { ReactNode, useContext, useState } from "react";
import { AppContext } from "../../../context/context";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import axios from "axios";
import {
  IAPIResponse,
  ICollectionDTOGET,
  IQPartDTOInclude,
  IUserDTO,
  IWantedDTOGET,
  user,
} from "../../../interfaces/general";
import showToast, { Mode, formatDate } from "../../../utils/utils";
import TopFiveCard from "../../../components/TopFiveCard";
import CollectionPart from "../../../components/CollectionPart";
import ColorLink from "../../../components/ColorLink";

export default function OtherUserProfileView() {
  const {
    state: {
      jwt: { payload },
    },
  } = useContext(AppContext);

  const [isUsernameBad, setIsUsernameBad] = useState<boolean>(false);
  const [overviewTabActive, setOverviewTabActive] = useState<boolean>(true);
  const [wantedTabActive, setWantedTabActive] = useState<boolean>(false);
  const [collectionTabActive, setCollectionTabActive] =
    useState<boolean>(false);
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
        // console.log(resp.data);

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
      return (
        <p className="grey-txt" style={{ marginLeft: "1em" }}>
          {user.name} has their favorite parts set to private.
        </p>
      );
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

  function getCollection(
    collectionParts: IQPartDTOInclude[] | undefined,
    user: IUserDTO
  ): ReactNode {
    if (!user.preferences.isCollectionVisible)
      return (
        <p className="grey-txt" style={{ marginLeft: "1em" }}>
          {user.name} has their collection set to private.
        </p>
      );
    const noPartsNode = (
      <p>{user.name} does not have any parts listed in their collection!</p>
    );
    if (collectionParts == undefined || collectionParts.length == 0)
      return noPartsNode;

    return (
      <div>
        {collectionParts.map((qpart) => {
          if (qpart.UserInventory) {
            let conversion: ICollectionDTOGET = {
              ...qpart.UserInventory,
              qpart,
            };

            return <CollectionPart key={qpart.id} data={conversion} />;
          }
        })}
      </div>
    );
  }

  if (username && userData && !isUsernameBad) {
    let user = userData.data as IUserDTO;
    let title = null;
    if (user.titles) {
      title = user.titles.find((t) => t.id == user.selectedTitleId);
    }
    console.log(user);

    return (
      <div className="formcontainer">
        <div className="profile-container" style={{ marginTop: "3em" }}>
          <div className=" profile-header">
            <img className="pfp" src="/img/blank_profile.webp" />
            <div
              style={{ marginLeft: "0.5em" }}
              className="d-flex flex-col jc-center"
            >
              <div className="profile-name">{username}</div>
              <div
                className={title ? title.cssClasses : ""}
                style={{ color: "#00BB00" }}
              >
                {title && title.title}
              </div>
            </div>
          </div>
          <div className="profile-lower-container">
            <div className="tab">
              <button
                className={"tablinks" + (overviewTabActive ? " active" : "")}
                onClick={() => {
                  setOverviewTabActive(true);
                  setWantedTabActive(false);
                  setCollectionTabActive(false);
                }}
              >
                Overview
              </button>
              <button
                className={"tablinks" + (collectionTabActive ? " active" : "")}
                onClick={() => {
                  setOverviewTabActive(false);
                  setWantedTabActive(false);
                  setCollectionTabActive(true);
                }}
              >
                Collection
              </button>
              <button
                className={"tablinks" + (wantedTabActive ? " active" : "")}
                onClick={() => {
                  setOverviewTabActive(false);
                  setCollectionTabActive(false);
                  setWantedTabActive(true);
                }}
              >
                Wanted
              </button>
            </div>
            <div
              className={
                "tabcontent profile-tab-content" +
                (overviewTabActive ? "" : " tabhidden")
              }
              style={{
                overflowY: "auto",
                height: "30em",
                margin: "0",
                borderRight: "none",
                borderLeft: "none",
              }}
            >
              <div className="profile-overview">
                <span>Date joined: {formatDate(user.createdAt, "short")}</span>
                <div>Submissions:</div>
                <div
                  className="d-flex flex-col"
                  style={{ marginBottom: "1em" }}
                >
                  <span style={{ marginLeft: "1.5em" }}>
                    Pending:{" "}
                    {user.submissionCount.totalPending > 0 ? (
                      <span className="red-txt">
                        {user.submissionCount.totalPending}
                      </span>
                    ) : (
                      <span className="grey-txt">None</span>
                    )}
                  </span>
                  <span style={{ marginLeft: "1.5em" }}>
                    Approved:{" "}
                    {user.submissionCount.totalApproved > 0 ? (
                      <span>{user.submissionCount.totalApproved}</span>
                    ) : (
                      <span className="grey-txt">None</span>
                    )}
                  </span>
                </div>
                <span>Role: {user.role}</span>
                <span className="d-flex ai-center">
                  <span style={{ marginRight: "0.5em" }}>Favorite Color:</span>
                  {user.favoriteColor ? (
                    <ColorLink color={user.favoriteColor} />
                  ) : (
                    <>none</>
                  )}
                </span>
              </div>
            </div>
            <div
              className={
                "tabcontent profile-tab-content" +
                (collectionTabActive ? "" : " tabhidden")
              }
              style={{ margin: "0", borderRight: "none", borderLeft: "none" }}
            >
              <div className="d-flex col-guide-profile jc-end">
                <div>Sale</div>
                <div>Trade</div>
                <div>Qty</div>
              </div>
              {getCollection(user.inventory, user)}
              <div className="comment-tab-content"></div>
              <div className="w-100 d-flex"></div>
            </div>

            <div
              className={
                "tabcontent profile-tab-content" +
                (wantedTabActive ? "" : " tabhidden")
              }
              style={{ margin: "0", borderRight: "none", borderLeft: "none" }}
            >
              {getTopFive(user.favoriteQParts, user)}
            </div>
          </div>
          <div className="topfive-container"></div>
        </div>
      </div>
    );
  } else if (isUsernameBad)
    return (
      <div className="mx-w">
        <p>User does not exist!</p>
      </div>
    );
  else
    return (
      <div className="mx-w">
        <p>Loading user...</p>
      </div>
    );
}
