import { useContext, useState } from "react";
import { AppContext } from "../../context/context";
import TopFive from "../../components/TopFive";
import { IWantedDTOGET } from "../../interfaces/general";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingPage from "../../components/LoadingPage";
import TopFiveCard from "../../components/TopFiveCard";

export default function WantedView() {
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);

  const [faveTab, setFaveTab] = useState<boolean>(true);

  const { data: mywantedData, refetch: mywantedRefetch } = useQuery({
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
    let myWantedParts = mywantedData.data;
    let myTopFive: IWantedDTOGET[] = [],
      myFavorites: IWantedDTOGET[] = [],
      myWanted: IWantedDTOGET[] = [],
      myOther: IWantedDTOGET[] = [];

    for (let part of myWantedParts) {
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
        <div className="padded-container">
          <h1>Your Wanted Items</h1>
          <div className="topfive-container">
            {myTopFive.map((myWantedPart) => (
              <TopFiveCard key={myWantedPart.id} myWantedPart={myWantedPart} />
            ))}
          </div>
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
