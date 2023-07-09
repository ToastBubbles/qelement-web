import { useContext, useState } from "react";
import { AppContext } from "../../context/context";
import axios from "axios";
import { useQuery } from "react-query";
import { ICollectionDTOGET, IGoalDTOExtended } from "../../interfaces/general";
import LoadingPage from "../../components/LoadingPage";
import PopupGoal from "../../components/PopupGoal";
import Goal from "../../components/Goal";

export default function CollectionView() {
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);
  const [goalPopupOpen, setGoalPopupOpen] = useState(false);

  const { data: mycollectionData, refetch: mycollectionRefetch } = useQuery({
    queryKey: "mycollection",
    queryFn: () => {
      return axios.get<ICollectionDTOGET[]>(
        `http://localhost:3000/userInventory/id/${payload.id}`
      );
    },
    staleTime: 100,
    enabled: !!payload.id,
  });

  const { data: myGoalData, refetch: myGoalRefetch } = useQuery({
    queryKey: "mygoals",
    queryFn: () => {
      return axios.get<IGoalDTOExtended[]>(
        `http://localhost:3000/userGoal/id/${payload.id}`
      );
    },
    staleTime: 100,
    enabled: !!payload.id,
  });
  if (mycollectionData && myGoalData) {
    let goals = myGoalData.data;
    let myParts = mycollectionData.data;
    return (
      <>
        <div className="padded-container">
          {goalPopupOpen && (
            <PopupGoal
              userId={payload.id}
              closePopup={() => setGoalPopupOpen(false)}
            />
          )}
          <h1>Your Collection</h1>
          <div>
            Goals
            <div className="d-flex">
              {goals.map((goal) => (
                <Goal key={goal.id} goal={goal} collection={myParts} />
              ))}
            </div>
            <div className="clickable" onClick={() => setGoalPopupOpen(true)}>
              Create New Goal
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
