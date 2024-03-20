import { useContext, useState } from "react";
import { AppContext } from "../../context/context";

import axios from "axios";
import { useQuery } from "react-query";
import LoadingPage from "../../components/LoadingPage";
import TopFiveCard from "../../components/TopFiveCard";
import { IWantedDTOGET } from "../../interfaces/general";
import RecentQPart from "../../components/RecentQPart";
import OnHoverX from "../../components/OnHoverX";
import showToast, { Mode } from "../../utils/utils";
import MyWantedItem from "../../components/MyWantedItem";

export default function WantedView() {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [topFiveTabActive, setTopFiveTabActive] = useState<boolean>(true);
  const [wantedTabActive, setWantedTabActive] = useState<boolean>(false);
  const [faveTabActive, setFaveTabActive] = useState<boolean>(false);
  const [otherTabActive, setOtherTabActive] = useState<boolean>(false);

  const { data: mywantedData, refetch: mywantedrefetch } = useQuery({
    queryKey: "mywanted",
    queryFn: () => {
      return axios.get<IWantedDTOGET[]>(
        `http://localhost:3000/userFavorite/id/${payload.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    staleTime: 100,
    enabled: !!payload.id,
  });
  if (mywantedData) {
    const myWantedParts = mywantedData.data;
    const myTopFive: IWantedDTOGET[] = [],
      myFavorites: IWantedDTOGET[] = [],
      myWanted: IWantedDTOGET[] = [],
      myOther: IWantedDTOGET[] = [];

    for (const part of myWantedParts) {
      switch (part.type) {
        case "topfive": {
          myTopFive.push(part);
          break;
        }
        case "favorite": {
          myFavorites.push(part);
          break;
        }
        case "wanted": {
          myWanted.push(part);
          break;
        }
        case "other": {
          myOther.push(part);
          break;
        }
        default: {
          break;
        }
      }
    }

    return (
      <>
        <div className="mx-w">
          <h1>Your Wanted Items</h1>
          <div className="grey-txt" style={{ marginBottom: "1em" }}>
            {prefPayload.isWantedVisible
              ? "Your Wanted Lists are visible to others"
              : "Your Wanted Lists are hidden from others"}
          </div>
          {/* <h2>
            Your Top {myTopFive.length > 0 ? myTopFive.length : "5"} Most Wanted
          </h2> */}

          {/* <h2>Wanted List</h2> */}

          <div className="tab">
            <button
              className={"tablinks" + (topFiveTabActive ? " active" : "")}
              onClick={() => {
                setWantedTabActive(false);
                setFaveTabActive(false);
                setOtherTabActive(false);
                setTopFiveTabActive(true);
              }}
            >
              Top {myTopFive.length > 0 ? myTopFive.length : 5}
            </button>
            <button
              className={"tablinks" + (wantedTabActive ? " active" : "")}
              onClick={() => {
                setWantedTabActive(true);
                setFaveTabActive(false);
                setOtherTabActive(false);
                setTopFiveTabActive(false);
              }}
            >
              Wanted {myWanted && myWanted.length > 0 && `(${myWanted.length})`}
            </button>
            <button
              className={"tablinks" + (faveTabActive ? " active" : "")}
              onClick={() => {
                setFaveTabActive(true);
                setWantedTabActive(false);
                setOtherTabActive(false);
                setTopFiveTabActive(false);
              }}
            >
              Favorites{" "}
              {myFavorites &&
                myFavorites.length > 0 &&
                `(${myFavorites.length})`}
            </button>
            <button
              className={"tablinks" + (otherTabActive ? " active" : "")}
              onClick={() => {
                setWantedTabActive(false);
                setFaveTabActive(false);
                setOtherTabActive(true);
                setTopFiveTabActive(false);
              }}
              // disabled={mypart?.images.length == 0}
            >
              Other {myOther && myOther.length > 0 && `(${myOther.length})`}
            </button>
          </div>
          <div
            className={"tabcontent  " + (topFiveTabActive ? "" : " tabhidden")}
            style={{ padding: "2em 1em" }}
          >
            <div className="topfive-container">
              {myTopFive.length > 0 ? (
                myTopFive.map((myWantedPart) => (
                  <TopFiveCard
                    key={myWantedPart.id}
                    myWantedPart={myWantedPart}
                    refetchFn={mywantedrefetch}
                    isMine={true}
                  />
                ))
              ) : (
                <p className="grey-txt">
                  You don't have anything in your Top Five!
                </p>
              )}
            </div>
          </div>

          <div
            className={"tabcontent " + (wantedTabActive ? "" : " tabhidden")}
            style={{ padding: "2em 1em" }}
          >
            {myWanted.length > 0 ? (
              myWanted.map((item) => <MyWantedItem key={item.id} item={item} />)
            ) : (
              <p className="grey-txt">
                You don't have anything in your Wanted list!
              </p>
            )}
          </div>

          <div
            className={"tabcontent " + (faveTabActive ? "" : " tabhidden")}
            style={{ padding: "2em 1em" }}
          >
            {" "}
            {myFavorites.length > 0 ? (
              myFavorites.map((item) => (
                <MyWantedItem key={item.id} item={item} />
              ))
            ) : (
              <p className="grey-txt">
                You don't have anything in your Favorites list!
              </p>
            )}
          </div>

          <div
            className={"tabcontent " + (otherTabActive ? "" : " tabhidden")}
            style={{ padding: "2em 1em" }}
          >
            {" "}
            {myOther.length > 0 ? (
              myOther.map((item) => <MyWantedItem key={item.id} item={item} />)
            ) : (
              <p className="grey-txt">
                You don't have anything in your Other list!
              </p>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
