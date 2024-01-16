import { useContext } from "react";
import { AppContext } from "../../context/context";

import axios from "axios";
import { useQuery } from "react-query";
import LoadingPage from "../../components/LoadingPage";
import TopFiveCard from "../../components/TopFiveCard";
import { IWantedDTOGET } from "../../interfaces/general";

export default function WantedView() {
  const {
    state: {
      jwt: { payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  // const [faveTab, setFaveTab] = useState<boolean>(true);

  const { data: mywantedData, refetch: mywantedrefetch } = useQuery({
    queryKey: "mywanted",
    queryFn: () => {
      return axios.get<IWantedDTOGET[]>(
        `http://localhost:3000/userFavorite/id/${payload.id}`
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
          <h2>
            Your Top {myTopFive.length > 0 ? myTopFive.length : "5"} Most Wanted
          </h2>
          <div className="topfive-container">
            {myTopFive.length > 0 ? (
              myTopFive.map((myWantedPart) => (
                <TopFiveCard
                  key={myWantedPart.id}
                  myWantedPart={myWantedPart}
                  refetchFn={mywantedrefetch}
                />
              ))
            ) : (
              <p>You don't have anything in your Top Five!</p>
            )}
          </div>
          <h2>Wanted List</h2>
          <div className="grey-txt">TODO</div>
          {/* <div className="tab">
            <button
              className={"tablinks" + (detailsTabActive ? " active" : "")}
              onClick={() => {
                setDetailsTabActive(true);
                // setImageTabActive(false);
                // setCommentTabActive(false);
              }}
            >
              Details
            </button>
            <button
              className={"tablinks" + (commentTabActive ? " active" : "")}
              onClick={() => {
                setDetailsTabActive(false);
                setImageTabActive(false);
                setCommentTabActive(true);
              }}
            >
              Comments{" "}
              {mypart?.comments &&
                mypart?.comments.length > 0 &&
                `(${mypart?.comments.length})`}
            </button>
            
            <button
              className={"tablinks" + (imageTabActive ? " active" : "")}
              onClick={() => {
                setDetailsTabActive(false);
                setCommentTabActive(false);
                setImageTabActive(true);
              }}
              disabled={mypart?.images.length == 0}
            >
              Images{" "}
              {mypart?.images &&
                filterImages(mypart?.images).length > 0 &&
                `(${filterImages(mypart?.images).length})`}
            </button>
          </div> */}
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
